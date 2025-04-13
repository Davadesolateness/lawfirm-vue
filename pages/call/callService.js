/**
 * 电话咨询服务模块
 * 用于处理律师电话咨询功能，包括加密电话号码、生成订单、计时计费等
 */

import { generateOrder, updateOrderStatus, ORDER_STATUS } from '../../utils/pay';

// 加密/解密密钥
const ENCRYPTION_KEY = 'lawfirm2024';

/**
 * 加密电话号码
 * @param {String} phoneNumber - 电话号码
 * @returns {String} 加密后的电话号码
 */
export function encryptPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  
  // 简单加密：保留前三位和后四位，中间用*替代
  if (phoneNumber.length > 7) {
    const prefix = phoneNumber.substring(0, 3);
    const suffix = phoneNumber.substring(phoneNumber.length - 4);
    const maskLength = phoneNumber.length - 7;
    const mask = '*'.repeat(maskLength);
    return `${prefix}${mask}${suffix}`;
  }
  
  // 如果号码长度不足，简单处理
  return phoneNumber.substring(0, 3) + '****';
}

/**
 * 解密电话号码（仅模拟）
 * @param {String} encryptedPhone - 加密后的电话号码
 * @returns {String} 解密后的电话号码（实际应用中应存储在服务端）
 */
export function decryptPhoneNumber(encryptedPhone) {
  // 在实际应用中，应该通过安全的服务端API获取解密后的电话号码
  // 这里仅为模拟，返回一个假的电话号码
  return '13812345678';
}

/**
 * 创建电话咨询订单
 * @param {Object} params - 咨询参数
 * @param {String} params.userId - 用户ID
 * @param {String} params.userName - 用户姓名
 * @param {String} params.userPhone - 用户电话号码
 * @param {String} params.lawyerId - 律师ID
 * @param {String} params.lawyerName - 律师姓名
 * @param {String} params.lawyerPhone - 律师电话号码
 * @param {Number} params.fee - 咨询费用（元/分钟）
 * @param {Number} params.duration - 预计咨询时长（分钟）
 * @returns {Object} 生成的订单对象
 */
export function createCallOrder(params) {
  const {
    userId,
    userName,
    userPhone,
    lawyerId,
    lawyerName,
    lawyerAvatar,
    lawyerTitle,
    lawyerPhone,
    fee,
    duration = 30 // 默认30分钟
  } = params;
  
  // 加密电话号码（存储时使用加密的号码）
  const encryptedUserPhone = encryptPhoneNumber(userPhone);
  const encryptedLawyerPhone = encryptPhoneNumber(lawyerPhone);
  
  // 计算总费用
  const totalFee = fee * duration;

  // 生成订单
  const order = generateOrder({
    ...params,
    totalFee,
    feeType: '电话咨询',
    consultTime: new Date().toISOString()
  })

  // 将加密后的电话号码存储到订单额外信息中
  // 实际应用中，应该将敏感信息安全地存储在服务端
  const callInfo = {
    userPhone: encryptPhoneNumber(params.userPhone),
    lawyerPhone: encryptPhoneNumber(params.lawyerPhone),
    callStatus: 'pending',
    freeDuration: 60, // 免费时长60秒
    billingStartTime: null,
    chargedDuration: 0
  }
  
  // 在真实应用中，这些敏感数据应该存储在服务端
  // 这里仅做模拟，将数据存储在本地
  saveCallInfo(order.orderId, callInfo);

  return order;

}

/**
 * 保存通话信息（模拟）
 * @param {String} orderId - 订单ID
 * @param {Object} callInfo - 通话信息
 */
function saveCallInfo(orderId, callInfo) {
  let callInfoData = uni.getStorageSync('call_info_data') || '{}';
  try {
    if (typeof callInfoData === 'string') {
      callInfoData = JSON.parse(callInfoData);
    }
  } catch (e) {
    callInfoData = {};
  }
  
  callInfoData[orderId] = callInfo;
  uni.setStorageSync('call_info_data', JSON.stringify(callInfoData));
}

/**
 * 获取通话信息
 * @param {String} orderId - 订单ID
 * @returns {Object|null} 通话信息
 */
export function getCallInfo(orderId) {
  let callInfoData = uni.getStorageSync('call_info_data') || '{}';
  try {
    if (typeof callInfoData === 'string') {
      callInfoData = JSON.parse(callInfoData);
    }
    
    return callInfoData[orderId] || null;
  } catch (e) {
    console.error('获取通话信息失败', e);
    return null;
  }
}

/**
 * 更新通话状态
 * @param {String} orderId - 订单ID
 * @param {String} status - 通话状态
 * @param {Object} additionalInfo - 额外信息
 * @returns {Boolean} 是否更新成功
 */
function updateCallStatus(orderId, status, additionalInfo = {}) {
  const callInfo = getCallInfo(orderId);
  if (!callInfo) return false;
  
  const updatedCallInfo = {
    ...callInfo,
    callStatus: status,
    ...additionalInfo
  };
  
  saveCallInfo(orderId, updatedCallInfo);
  return true;
}

/**
 * 发起电话咨询
 * @param {Object} params - 通话参数
 * @param {String} params.orderId - 订单ID
 * @param {Function} params.onStateChange - 状态变更回调
 * @param {Function} params.onSuccess - 成功回调
 * @param {Function} params.onFail - 失败回调
 */
export function makeCall(params) {
  const { orderId, onStateChange, onSuccess, onFail } = params;
  
  // 获取通话信息
  const callInfo = getCallInfo(orderId);
  if (!callInfo) {
    onFail && onFail({ errMsg: '未找到通话信息' });
    return;
  }
  
  // 检查订单状态，应该是已支付状态
  // 实际应用中，需要检查订单支付状态
  
  // 解密律师电话号码（实际应通过安全API获取）
  // 这里仅作模拟
  const lawyerPhone = decryptPhoneNumber(callInfo.lawyerPhone);
  
  // 通知状态变更：连接中
  updateCallStatus(orderId, 'connecting');
  onStateChange && onStateChange({
    status: 'connecting',
    message: '正在连接律师...'
  });
  
  // 模拟连接延迟
  const timer = setTimeout(() => {
    // 随机模拟接通或失败
    const isConnected = Math.random() > 0.2; // 80%概率接通
    
    if (isConnected) {
      // 通话接通
      const startTime = new Date();
      
      updateCallStatus(orderId, 'connected', {
        startTime: startTime.toISOString(),
        callRecords: [...(callInfo.callRecords || []), {
          action: 'connected',
          time: startTime.toISOString(),
          message: '通话已接通'
        }]
      });
      
      onStateChange && onStateChange({
        status: 'connected',
        message: '通话已接通',
        startTime
      });
      
      // 模拟一个计时器，用于更新通话时长和计费
      // 实际应用中，这应该由服务端处理
      startCallTimer(orderId, startTime, onStateChange);
      
      // 更新订单状态为进行中
      updateOrderStatus(orderId, ORDER_STATUS.IN_PROGRESS);
      
      onSuccess && onSuccess({
        orderId,
        status: 'connected',
        startTime
      });
    } else {
      // 通话失败
      updateCallStatus(orderId, 'failed', {
        callRecords: [...(callInfo.callRecords || []), {
          action: 'failed',
          time: new Date().toISOString(),
          message: '未能接通律师电话'
        }]
      });
      
      onStateChange && onStateChange({
        status: 'failed',
        message: '未能接通律师电话'
      });
      
      onFail && onFail({
        errMsg: '未能接通律师电话'
      });
    }
  }, 3000);
  
  // 返回一个取消函数
  return {
    cancel: () => {
      clearTimeout(timer);
      
      updateCallStatus(orderId, 'cancelled', {
        callRecords: [...(callInfo.callRecords || []), {
          action: 'cancelled',
          time: new Date().toISOString(),
          message: '用户取消拨号'
        }]
      });
      
      onStateChange && onStateChange({
        status: 'cancelled',
        message: '已取消拨号'
      });
    }
  };
}

/**
 * 启动通话计时器
 * @param {String} orderId - 订单ID
 * @param {Date} startTime - 开始时间
 * @param {Function} onStateChange - 状态变更回调
 */
// 更新计时逻辑
function startCallTimer(orderId, startTime) {
  let timer;
  let duration = 0;

  const update = () => {
    duration += 1
    const callInfo = getCallInfo(orderId)

    // 超过免费时长开始计费
    if (duration > callInfo.freeDuration && !callInfo.billingStartTime) {
      callInfo.billingStartTime = new Date().toISOString()
      saveCallInfo(orderId, callInfo)
    }

    // 计算计费时长
    const charged = duration > callInfo.freeDuration
        ? duration - callInfo.freeDuration
        : 0

    saveCallInfo(orderId, {
      ...callInfo,
      actualDuration: duration,
      chargedDuration: charged
    })
  }

  timer = setInterval(update, 1000)

  return {
    stop: () => clearInterval(timer)
  }
}


/**
 * 结束通话
 * @param {String} orderId - 订单ID
 * @returns {Boolean} 是否结束成功
 */
export function endCall(orderId) {
  const callInfo = getCallInfo(orderId);
  if (!callInfo || callInfo.callStatus !== 'connected') {
    return false;
  }
  
  // 计算通话时长
  let duration = 0;
  let chargedDuration = 0;
  
  if (callInfo.startTime) {
    const startTime = new Date(callInfo.startTime);
    const endTime = new Date();
    duration = Math.floor((endTime - startTime) / 1000);
    
    // 计算计费时长（超过1分钟的部分）
    if (duration > 60) {
      chargedDuration = duration - 60;
    }
  }
  
  // 更新通话状态
  updateCallStatus(orderId, 'completed', {
    endTime: new Date().toISOString(),
    actualDuration: duration,
    chargedDuration,
    callRecords: [...(callInfo.callRecords || []), {
      action: 'completed',
      time: new Date().toISOString(),
      message: '通话已结束',
      duration,
      chargedDuration
    }]
  });
  
  // 更新订单状态
  updateOrderStatus(orderId, ORDER_STATUS.COMPLETED);
  
  return true;
}

/**
 * 格式化通话时长
 * @param {Number} seconds - 秒数
 * @returns {String} 格式化后的时长
 */
export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default {
  encryptPhoneNumber,
  createCallOrder,
  makeCall,
  endCall,
  getCallInfo,
  formatDuration
}; 