import { apiCreateCallOrder, apiCompleteCallOrder, apiDeductUserDiscount } from "@/api/orderapi"
import {cacheManager} from "@/utils/store"

// 加密配置
const ENCRYPTION_CONFIG = {
    prefixLength: 3,
    suffixLength: 4,
    maskChar: '*'
}

// 通话状态枚举
export const CALL_STATUS = {
    IDLE: 'idle',
    CALLING: 'calling',
    ENDED: 'ended',
    FAILED: 'failed'
}

// 通话服务类
class CallService {
    constructor() {
        this.callState = CALL_STATUS.IDLE
        this.startTime = null
        this.endTime = null
        this.currentOrder = null
        this.lawyerInfo = null
        this.listeners = new Map()
    }

    /**
     * 开始通话咨询
     * @param {Object} params - 通话参数
     * @param {Object} params.lawyerInfo - 律师信息
     * @param {Number} params.serviceDuration - 服务时长（分钟）
     * @returns {Promise} 通话开始结果
     */
    async startCall(params) {
        try {
            const { lawyerInfo, serviceDuration = 30 } = params
            
            // 获取用户信息
            const userInfo = cacheManager.getCache('userInfo');
            if (!userInfo) {
                throw new Error('请先登录')
            }

            // 验证律师手机号
            if (!lawyerInfo.phone || !this._validatePhoneNumber(lawyerInfo.phone)) {
                throw new Error('律师联系方式无效')
            }

            this.lawyerInfo = lawyerInfo
            this.callState = CALL_STATUS.CALLING
            this.startTime = new Date()

            // 拨打电话（不等待拨号结果）
            this._makePhoneCall(lawyerInfo.phone)

            return {
                success: true,
                message: '已发起通话，系统将自动计时'
            }

        } catch (error) {
            this.callState = CALL_STATUS.FAILED
            throw error
        }
    }

    /**
     * 自动结束通话并生成订单
     * @param {Number} serviceDuration - 服务时长（秒）
     * @param {Date} startTime - 通话开始时间
     */
    async _autoEndCall(serviceDuration, startTime) {
        try {
            this.endTime = new Date()
            this.callState = CALL_STATUS.ENDED

            // 将秒数转换为分钟
            const serviceDurationInMinutes = Math.ceil(serviceDuration / 60);

            // 计算服务次数（根据律师的收费标准和通话时长）
            const serviceCount = Math.ceil(serviceDurationInMinutes / 30);

            // 生成订单
            const userInfo = cacheManager.getCache('userInfo');
            if (userInfo) {
                const orderData = {
                    userId: userInfo.userId,
                    lawyerId: this.lawyerInfo.id,
                    serviceDuration: serviceDurationInMinutes,
                    serviceCount: serviceCount,
                    startTime: this._formatDate(startTime),
                    endTime: this._formatDate(this.endTime),
                    userType: userInfo.userType
                }

                try {
                    const order = await apiCreateCallOrder(orderData)
                    this.currentOrder = order
                    console.log('订单生成成功:', order)
                } catch (error) {
                    console.warn('生成订单失败:', error)
                }

                // 扣减优惠次数
                try {
                    debugger
                    await apiDeductUserDiscount({
                        userId: userInfo.userId,
                        orderId: this.currentOrder?.orderId
                    })
                } catch (error) {
                    console.warn('扣减优惠次数失败:', error)
                }
            }

            console.log(`通话自动结束，时长：${serviceDurationInMinutes}分钟，费用：¥${serviceCount.toFixed(2)}`)
            
            // 重置状态
            this.reset()

        } catch (error) {
            console.error('自动结束通话失败:', error)
        }
    }

    /**
     * 格式化日期为 "年月日时分秒" 格式
     * @param {Date} date - 日期对象
     * @returns {String} 格式化后的日期字符串
     */
    _formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * 拨打电话
     * @param {String} phoneNumber - 电话号码
     */
    _makePhoneCall(phoneNumber) {
        uni.makePhoneCall({
            phoneNumber: phoneNumber,
            success: () => {
                console.log('拨号成功')
            },
            fail: (error) => {
                console.error('拨号失败:', error)
                this.callState = CALL_STATUS.FAILED
                this._notifyStateChange()
            }
        })
    }

    /**
     * 获取当前通话状态
     */
    getCallState() {
        return this.callState
    }

    /**
     * 是否正在通话
     */
    isCalling() {
        return this.callState === CALL_STATUS.CALLING
    }

    /**
     * 添加状态监听器
     */
    addStateListener(callback) {
        const id = Date.now() + Math.random()
        this.listeners.set(id, callback)
        return id
    }

    /**
     * 移除状态监听器
     */
    removeStateListener(id) {
        this.listeners.delete(id)
    }

    /**
     * 通知状态变化
     */
    _notifyStateChange() {
        const data = {
            state: this.callState,
            startTime: this.startTime,
            endTime: this.endTime,
            orderId: this.currentOrder?.orderId
        }
        
        this.listeners.forEach(callback => {
            try {
                callback(data)
            } catch (error) {
                console.error('监听器回调错误:', error)
            }
        })
    }

    /**
     * 验证电话号码
     */
    _validatePhoneNumber(phoneNumber) {
        return /^1[3-9]\d{9}$/.test(phoneNumber)
    }

    /**
     * 重置服务状态
     */
    reset() {
        this.callState = CALL_STATUS.IDLE
        this.startTime = null
        this.endTime = null
        this.currentOrder = null
        this.lawyerInfo = null
    }
}

// 创建全局通话服务实例
const callService = new CallService()

// 导出服务实例和工具函数
export { callService }

/**
 * 创建通话订单（保持向后兼容）
 * @param {Object} params - 订单参数
 * @param {Object} params.lawyerInfo - 律师信息
 * @param {Number} params.duration - 预约时长（分钟）
 * @returns {Object} 订单对象
 */
export function createCallOrder(params) {
    const { lawyerInfo, duration } = params
    const orderId = `CALL-${Date.now()}`

    const order = {
        orderId,
        lawyerInfo: {
            ...lawyerInfo,
            phone: encryptPhone(lawyerInfo.phone)
        },
        createTime: new Date().toISOString(),
        status: 'pending',
        totalFee: (duration * (lawyerInfo.fee || 38) / 30).toFixed(2)
    }

    saveOrder(order)
    return order
}

/**
 * 加密电话号码
 * @param {String} phone - 原始电话号码
 * @returns {String} 加密后的电话号码
 */
function encryptPhone(phone) {
    if (!phone) return ''
    const prefix = phone.substr(0, ENCRYPTION_CONFIG.prefixLength)
    const suffix = phone.substr(-ENCRYPTION_CONFIG.suffixLength)
    return `${prefix}${ENCRYPTION_CONFIG.maskChar.repeat(
        phone.length - ENCRYPTION_CONFIG.prefixLength - ENCRYPTION_CONFIG.suffixLength
    )}${suffix}`
}

/**
 * 保存订单到本地存储
 * @param {Object} order - 订单对象
 */
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('callOrders') || '[]')
    orders.push(order)
    localStorage.setItem('callOrders', JSON.stringify(orders))
}

/**
 * 结束通话（保持向后兼容）
 * @returns {Promise} 异步操作结果
 */
export function endCall() {
    return callService.endCall()
}

/**
 * 格式化通话时长
 * @param {Number} seconds - 总秒数
 * @returns {String} 格式化后的时间字符串(mm:ss)
 */
export function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`

}