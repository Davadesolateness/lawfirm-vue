/**
 * 微信支付工具模块（增强版）
 * 集成订单生成与支付流程，支持模拟数据
 */

// 系统模块依赖
import {getUserInfo} from './store/userManager';

// ================== 配置常量 ==================
const WX_PAY_CONFIG = {
    CURRENCY_UNIT: 100,         // 微信支付单位（分）
    PAYMENT_TIMEOUT: 5 * 60 * 1000, // 支付超时时间
    ORDER_EXPIRE: 15 * 60 * 1000    // 订单有效期
};

// ================== 状态常量 ==================
export const ORDER_STATUS = {
    PENDING_PAYMENT: 1,        // 待支付
    IN_PROGRESS: 2,            // 进行中
    COMPLETED: 3,              // 已完成
    CANCELLED: 4               // 已取消
};

export const ORDER_STATUS_TEXT = {
    [ORDER_STATUS.PENDING_PAYMENT]: '待支付',
    [ORDER_STATUS.IN_PROGRESS]: '服务中',
    [ORDER_STATUS.COMPLETED]: '已完成',
    [ORDER_STATUS.CANCELLED]: '已取消'
};

export const CONSULTATION_TYPES = {
    PHONE: '电话咨询',
    VIDEO: '视频咨询',
    ONLINE: '在线咨询',
    FACE_TO_FACE: '面谈咨询'
};

// ================== 核心功能 ==================
const ORDERS_STORAGE_KEY = 'law_orders_v2';

/**
 * 集成支付订单生成与支付流程
 * @param {Object} params - 支付参数
 * @param {String} params.userId - 用户ID
 * @param {String} params.lawyerId - 律师ID
 * @param {Number} params.fee - 咨询费用（元）
 * @param {String} params.consultType - 咨询类型
 */
export function wxPay(params) {
    // 参数校验
    const required = ['userId', 'lawyerId', 'fee', 'consultType'];
    if (required.some(key => !params[key])) {

        //return handlePaymentError('缺少必要支付参数', params.fail);
    }

    try {
        // 生成订单
        const order = generateOrder({
            ...params,
            feeType: CONSULTATION_TYPES[params.consultType],
            userName: getUserInfo(params.userId)?.name || '微信用户'
        });

        // 执行支付
        uni.showLoading({title: '发起支付中...', mask: true});

        // 仅微信小程序才可用requestPayment方法
        /*uni.requestPayment({
            provider: 'wxpay',
            orderInfo: getPaymentParams(order),
            success: () => handlePaymentSuccess(order.orderId, params.success),
            fail: (err) => handlePaymentError(err.errMsg, params.fail)
        });*/

    } catch (error) {
        handlePaymentError(`支付流程异常: ${error.message}`, params.fail);
    }
}

/**
 * 生成支付订单参数
 */
function getPaymentParams(order) {
    return {
        timeStamp: String(Date.now()),
        nonceStr: generateNonceStr(),
        package: `prepay_id=${generateOrderId()}`,
        signType: 'MD5',
        //paySign: generateSignature(),
        totalFee: order.fee * 100,
        description: `${order.feeType}（${order.duration}分钟）`
    };
}

/**
 * 统一处理支付错误
 */
function handlePaymentError(message, failCallback) {
    uni.showToast({
        title: message,
        icon: 'none',
        duration: 3000
    });
    failCallback?.({errMsg: message});
    // 记录错误日志
    console.error('Payment Error:', message);
}

// ================== 订单管理 ==================
/**
 * 生成完整订单
 */
export function generateOrder(params) {
    const orderId = generateOrderId();

    const newOrder = {
        orderId,
        createTime: new Date().toISOString(),
        paymentExpireTime: new Date(Date.now() + WX_PAY_CONFIG.ORDER_EXPIRE).toISOString(),
        status: ORDER_STATUS.PENDING_PAYMENT,
        statusText: ORDER_STATUS_TEXT[ORDER_STATUS.PENDING_PAYMENT],
        userName: params.userName || '匿名用户',
        userId: params.userId,
        lawyerId: params.lawyerId,
        lawyerName: params.lawyerName || '平台律师',
        lawyerAvatar: params.lawyerAvatar || '/static/images/avatar_default.png',
        fee: Number(params.fee).toFixed(2),
        feeType: params.feeType,
        duration: params.duration || 30,
        consultTime: params.consultTime || new Date().toISOString(),
        paymentRetry: 0  // 支付重试次数
    };

    saveOrder(newOrder);
    return newOrder;
}


// ================== 工具方法 ==================
function generateOrderId() {
    const date = new Date();
    return `PAY${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${Math.random().toString().substr(2, 6)}`;
}

function generateNonceStr(length = 16) {
    return Array.from({length}, () => Math.random().toString(36)[2]).join('');
}

// ================== 数据管理 ==================
function saveOrder(order) {
    const orders = getLocalOrders();
    orders.unshift(order);
    uni.setStorageSync(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function getLocalOrders() {
    return JSON.parse(uni.getStorageSync(ORDERS_STORAGE_KEY) || '[]');
}

// ================== 模拟数据 ==================
export function initDemoOrders() {
    const demoData = [
        {
            orderId: 'PAY202403150001',
            createTime: '2024-03-15T09:30:00Z',
            userId: 'U1001',
            lawyerId: 'L2001',
            fee: '299.00',
            feeType: '视频咨询',
            duration: 60,
            status: ORDER_STATUS.COMPLETED,
            lawyerName: '王律师',
            consultTime: '2024-03-15T14:30:00Z'
        },
        {
            orderId: 'PAY202403140002',
            createTime: '2024-03-14T16:45:00Z',
            userId: 'U1002',
            lawyerId: 'L2003',
            fee: '199.00',
            feeType: '电话咨询',
            duration: 30,
            status: ORDER_STATUS.IN_PROGRESS,
            lawyerName: '李律师',
            paymentRetry: 2
        },
        {
            orderId: 'PAY202403130003',
            createTime: '2024-03-13T11:20:00Z',
            userId: 'U1003',
            lawyerId: 'L2005',
            fee: '599.00',
            feeType: '面谈咨询',
            duration: 120,
            status: ORDER_STATUS.CANCELLED,
            cancelTime: '2024-03-13T11:25:00Z'
        }
    ];

    // 合并已有数据
    const existing = getLocalOrders().filter(o => !demoData.find(d => d.orderId === o.orderId));
    uni.setStorageSync(ORDERS_STORAGE_KEY, JSON.stringify([...demoData, ...existing]));
}

// ================== 初始化 ==================
// 启动定时任务（每5分钟清理过期订单）
setInterval(() => {
    const validOrders = getLocalOrders().filter(order =>
        order.status !== ORDER_STATUS.PENDING_PAYMENT ||
        new Date(order.paymentExpireTime) > new Date()
    );
    uni.setStorageSync(ORDERS_STORAGE_KEY, JSON.stringify(validOrders));
}, 5 * 60 * 1000);

// 初始化模拟数据
initDemoOrders();

export default {
    wxPay,
    generateOrder,
    getOrders: getLocalOrders,
    ORDER_STATUS,
    ORDER_STATUS_TEXT,
    CONSULTATION_TYPES
};