/**
 * 微信支付工具模块
 * 提供微信支付相关功能和订单生成
 */

// 微信支付工具类
import { getUserInfo } from './userManager';

// 订单状态常量
export const ORDER_STATUS = {
  PENDING_PAYMENT: 1, // 待支付
  IN_PROGRESS: 2,    // 进行中
  COMPLETED: 3,      // 已完成
  CANCELLED: 4       // 已取消
};

// 订单状态文本
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAYMENT]: '待支付',
  [ORDER_STATUS.IN_PROGRESS]: '进行中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
};

// 咨询类型
export const CONSULTATION_TYPES = {
  PHONE: '电话咨询',
  VIDEO: '视频咨询',
  ONLINE: '在线咨询',
  FACE_TO_FACE: '面对面咨询'
};

// 本地存储键
const ORDERS_STORAGE_KEY = 'law_orders';

/**
 * 生成唯一订单号
 * @returns {string} 格式为 LS + 年月日 + 4位随机数字
 */
export function generateOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `LS${year}${month}${day}${random}`;
}

/**
 * 生成订单
 * @param {Object} params - 订单参数
 * @param {String} params.userName - 用户姓名
 * @param {String} params.userId - 用户ID
 * @param {String} params.lawyerId - 律师ID
 * @param {String} params.lawyerName - 律师姓名
 * @param {String} params.lawyerAvatar - 律师头像
 * @param {String} params.lawyerTitle - 律师头衔
 * @param {Number} params.fee - 费用
 * @param {String} params.feeType - 费用类型（电话咨询、视频咨询等）
 * @param {Number} params.duration - 咨询时长（分钟）
 * @param {String} params.consultTime - 咨询时间
 * @returns {Object} 生成的订单对象
 */
export function generateOrder(params) {
  const { 
    userName, 
    userId, 
    lawyerId, 
    lawyerName, 
    lawyerAvatar = '/static/images/lawyer_avatar.jpg',
    lawyerTitle,
    fee,
    feeType,
    duration,
    consultTime
  } = params;
  
  // 生成订单
  const order = {
    orderId: generateOrderId(),
    createTime: new Date().toISOString(),
    userName: userName || '匿名用户',
    userId: userId || '0',
    lawyerId: lawyerId || '0',
    lawyerName: lawyerName || '未知律师',
    lawyerAvatar,
    lawyerTitle: lawyerTitle || '律师',
    fee: fee || 0,
    feeType: feeType || '咨询服务',
    duration: duration || 30,
    consultTime: consultTime || new Date().toISOString(),
    status: ORDER_STATUS.PENDING_PAYMENT,
    statusText: ORDER_STATUS_TEXT[ORDER_STATUS.PENDING_PAYMENT],
    payTime: null,
    completeTime: null,
    cancelTime: null,
    comment: null,
    rating: 0
  };
  
  // 保存到本地存储
  const orders = getLocalOrders();
  orders.unshift(order);
  saveOrdersToStorage(orders);
  
  return order;
}

/**
 * 微信支付
 * @param {Object} params - 支付参数
 * @param {String} params.orderId - 订单ID
 * @param {Number} params.totalFee - 总金额（单位：元）
 * @param {String} params.description - 商品描述
 * @param {Function} params.success - 支付成功回调
 * @param {Function} params.fail - 支付失败回调
 */
export function wxPay(params) {
  const { orderId, totalFee, description, success, fail } = params;
  
  // 检查环境是否支持微信支付
  if (!checkWxPaySupport()) {
    uni.showToast({
      title: '当前环境不支持微信支付',
      icon: 'none'
    });
    fail && fail({ errMsg: '当前环境不支持微信支付' });
    return;
  }
  
  // 模拟微信支付流程
  uni.showLoading({
    title: '正在请求支付...'
  });
  
  // 模拟支付请求延迟
  setTimeout(() => {
    uni.hideLoading();
    
    // 模拟用户确认支付操作
    uni.showModal({
      title: '支付确认',
      content: `确认支付 ¥${totalFee.toFixed(2)} 元吗？`,
      success: (res) => {
        if (res.confirm) {
          // 模拟支付处理中
          uni.showLoading({
            title: '支付处理中...'
          });
          
          // 模拟支付结果延迟
          setTimeout(() => {
            uni.hideLoading();
            
            // 模拟随机支付结果，实际应用中应根据服务器返回结果判断
            const isPaySuccess = Math.random() > 0.1; // 90%概率支付成功
            
            if (isPaySuccess) {
              // 更新订单状态
              updateOrderStatus(orderId, ORDER_STATUS.IN_PROGRESS);
              
              // 调用成功回调
              success && success({
                orderId,
                payTime: new Date().toISOString()
              });
            } else {
              // 支付失败
              uni.showToast({
                title: '支付失败，请重试',
                icon: 'none'
              });
              
              fail && fail({ errMsg: '支付失败，请重试' });
            }
          }, 1500);
        } else {
          // 用户取消支付
          fail && fail({ errMsg: '用户取消支付' });
        }
      }
    });
  }, 1000);
}

/**
 * 检查环境是否支持微信支付
 * @returns {Boolean} 是否支持微信支付
 */
function checkWxPaySupport() {
  // 获取当前运行环境
  const systemInfo = uni.getSystemInfoSync();
  
  // 检查是否在微信环境中
  if (systemInfo.platform === 'devtools') {
    // 开发工具中，模拟支持微信支付
    return true;
  }
  
  // 检查是否在微信小程序中
  if (systemInfo.platform === 'mp-weixin') {
    return true;
  }
  
  // 检查是否在微信浏览器中
  if (systemInfo.platform === 'web' && /MicroMessenger/i.test(navigator.userAgent)) {
    return true;
  }
  
  // 其他环境默认支持（模拟）
  return true;
}

/**
 * 从本地存储获取订单列表
 * @returns {Array} 订单列表
 */
function getLocalOrders() {
  try {
    const ordersStr = uni.getStorageSync(ORDERS_STORAGE_KEY);
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (e) {
    console.error('获取本地订单失败', e);
    return [];
  }
}

/**
 * 保存订单列表到本地存储
 * @param {Array} orders - 订单列表
 */
function saveOrdersToStorage(orders) {
  try {
    uni.setStorageSync(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('保存订单失败', e);
  }
}

/**
 * 获取所有订单
 * @param {number} status 可选，按状态筛选
 * @returns {Array} 订单列表
 */
export function getOrders(status) {
  const orders = getLocalOrders();
  
  // 如果未提供状态，返回所有订单
  if (status === undefined) {
    return orders;
  }
  
  // 根据状态筛选
  return orders.filter(order => order.status === status);
}

/**
 * 获取订单详情
 * @param {string} orderId 订单ID
 * @returns {Object|null} 订单详情或null
 */
export function getOrderDetail(orderId) {
  const orders = getLocalOrders();
  return orders.find(order => order.orderId === orderId) || null;
}

/**
 * 更新订单状态
 * @param {String} orderId - 订单ID
 * @param {Number} status - 新状态
 * @returns {Boolean} 是否更新成功
 */
export function updateOrderStatus(orderId, status) {
  const orders = getLocalOrders();
  const orderIndex = orders.findIndex(order => order.orderId === orderId);
  
  if (orderIndex === -1) {
    return false;
  }
  
  const order = orders[orderIndex];
  
  // 更新状态
  order.status = status;
  order.statusText = ORDER_STATUS_TEXT[status];
  
  // 根据状态更新相应的时间字段
  switch (status) {
    case ORDER_STATUS.IN_PROGRESS:
      order.payTime = new Date().toISOString();
      break;
    case ORDER_STATUS.COMPLETED:
      order.completeTime = new Date().toISOString();
      break;
    case ORDER_STATUS.CANCELLED:
      order.cancelTime = new Date().toISOString();
      break;
  }
  
  // 保存更新后的订单列表
  orders[orderIndex] = order;
  saveOrdersToStorage(orders);
  
  return true;
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @returns {Boolean} 是否取消成功
 */
export function cancelOrder(orderId) {
  return updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
}

/**
 * 添加订单评价
 * @param {String} orderId - 订单ID
 * @param {Object} commentData - 评价数据
 * @param {String} commentData.content - 评价内容
 * @param {Number} commentData.rating - 评分（1-5）
 * @returns {Boolean} 是否评价成功
 */
export function addOrderComment(orderId, commentData) {
  const orders = getLocalOrders();
  const orderIndex = orders.findIndex(order => order.orderId === orderId);
  
  if (orderIndex === -1) {
    return false;
  }
  
  const order = orders[orderIndex];
  
  // 更新评价信息
  order.comment = commentData.content;
  order.rating = commentData.rating;
  
  // 保存更新后的订单列表
  orders[orderIndex] = order;
  saveOrdersToStorage(orders);
  
  return true;
}

/**
 * 初始化模拟订单数据（仅用于演示）
 */
export function initDemoOrders() {
  const orders = getLocalOrders();
  
  // 如果已经有订单数据，则不初始化
  if (orders.length > 0) {
    return;
  }
  
  // 模拟一些订单数据
  const demoOrders = [
    {
      orderId: 'LS202408120001',
      createTime: '2024-08-12T06:30:00.000Z',
      userName: '张三',
      userId: '1001',
      lawyerId: '2001',
      lawyerName: '李律师',
      lawyerAvatar: '/static/images/lawyer_avatar.jpg',
      lawyerTitle: '合同纠纷专家',
      fee: 99.00,
      feeType: '电话咨询',
      duration: 30,
      consultTime: '2024-08-12 14:30',
      status: ORDER_STATUS.PENDING_PAYMENT,
      statusText: ORDER_STATUS_TEXT[ORDER_STATUS.PENDING_PAYMENT],
      payTime: null,
      completeTime: null,
      cancelTime: null,
      comment: null,
      rating: 0
    },
    {
      orderId: 'LS202408110023',
      createTime: '2024-08-11T02:15:00.000Z',
      userName: '李四',
      userId: '1002',
      lawyerId: '2002',
      lawyerName: '王律师',
      lawyerAvatar: '/static/images/lawyer_avatar.jpg',
      lawyerTitle: '婚姻家庭专家',
      fee: 199.00,
      feeType: '视频咨询',
      duration: 60,
      consultTime: '2024-08-11 10:15',
      status: ORDER_STATUS.COMPLETED,
      statusText: ORDER_STATUS_TEXT[ORDER_STATUS.COMPLETED],
      payTime: '2024-08-11T02:20:00.000Z',
      completeTime: '2024-08-11T03:25:00.000Z',
      cancelTime: null,
      comment: '服务非常专业，解答了我所有的问题',
      rating: 5
    },
    {
      orderId: 'LS202408090015',
      createTime: '2024-08-09T08:45:00.000Z',
      userName: '王五',
      userId: '1003',
      lawyerId: '2003',
      lawyerName: '赵律师',
      lawyerAvatar: '/static/images/lawyer_avatar.jpg',
      lawyerTitle: '劳动纠纷专家',
      fee: 59.00,
      feeType: '电话咨询',
      duration: 15,
      consultTime: '2024-08-09 16:45',
      status: ORDER_STATUS.COMPLETED,
      statusText: ORDER_STATUS_TEXT[ORDER_STATUS.COMPLETED],
      payTime: '2024-08-09T08:50:00.000Z',
      completeTime: '2024-08-09T09:10:00.000Z',
      cancelTime: null,
      comment: '解答很到位，但时间有点短',
      rating: 4
    },
    {
      orderId: 'LS202408050078',
      createTime: '2024-08-05T01:30:00.000Z',
      userName: '赵六',
      userId: '1004',
      lawyerId: '2004',
      lawyerName: '钱律师',
      lawyerAvatar: '/static/images/lawyer_avatar.jpg',
      lawyerTitle: '知识产权专家',
      fee: 299.00,
      feeType: '在线咨询',
      duration: 45,
      consultTime: '2024-08-05 09:30',
      status: ORDER_STATUS.IN_PROGRESS,
      statusText: ORDER_STATUS_TEXT[ORDER_STATUS.IN_PROGRESS],
      payTime: '2024-08-05T01:35:00.000Z',
      completeTime: null,
      cancelTime: null,
      comment: null,
      rating: 0
    },
    {
      orderId: 'LS202408030042',
      createTime: '2024-08-03T03:00:00.000Z',
      userName: '刘七',
      userId: '1005',
      lawyerId: '2005',
      lawyerName: '孙律师',
      lawyerAvatar: '/static/images/lawyer_avatar.jpg',
      lawyerTitle: '刑事辩护专家',
      fee: 399.00,
      feeType: '视频咨询',
      duration: 60,
      consultTime: '2024-08-03 11:00',
      status: ORDER_STATUS.CANCELLED,
      statusText: ORDER_STATUS_TEXT[ORDER_STATUS.CANCELLED],
      payTime: null,
      completeTime: null,
      cancelTime: '2024-08-03T03:10:00.000Z',
      comment: null,
      rating: 0
    }
  ];
  
  // 保存模拟订单
  saveOrdersToStorage(demoOrders);
}

// 初始化演示数据
initDemoOrders();

export default {
  wxPay,
  generateOrder,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
  generateOrderId,
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  CONSULTATION_TYPES
};
