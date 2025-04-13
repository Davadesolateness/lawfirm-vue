

// 加密配置
const ENCRYPTION_CONFIG = {
  prefixLength: 3,
  suffixLength: 4,
  maskChar: '*'
}

/**
 * 创建通话订单
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
    totalFee: (duration * lawyerInfo.fee).toFixed(2)
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
 * 结束通话
 * @returns {Promise} 异步操作结果
 */
export function endCall() {
  return new Promise((resolve) => {
    // 实际应调用挂断电话的API
    setTimeout(() => resolve({ success: true }), 500)
  })
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