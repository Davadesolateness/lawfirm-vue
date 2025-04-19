/**
 * 通用缓存管理工具
 * 提供统一的缓存数据方法，支持设置过期时间、JSON对象存储和获取
 */

// 默认过期时间（毫秒）：24小时
const DEFAULT_EXPIRE_TIME = 24 * 60 * 60 * 1000;

// 缓存键名常量
export const CACHE_KEY = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  TOKEN_EXPIRE_TIME: 'token_expire_time'
};

/**
 * 设置缓存数据
 * @param {String} key 缓存键名
 * @param {Any} data 要缓存的数据，可以是任意类型
 * @param {Number} expireTime 过期时间（毫秒），不传则使用默认24小时
 * @returns {Boolean} 是否设置成功
 */
export const setCache = (key, data, expireTime = DEFAULT_EXPIRE_TIME) => {
  if (!key) {
    console.error('缓存键名不能为空');
    return false;
  }

  try {
    const cacheData = {
      data: data,
      expire: expireTime > 0 ? Date.now() + expireTime : 0, // 0表示永不过期
    };
    
    uni.setStorageSync(key, JSON.stringify(cacheData));
    return true;
  } catch (e) {
    console.error(`设置缓存失败: ${key}`, e);
    return false;
  }
};

/**
 * 获取缓存数据
 * @param {String} key 缓存键名
 * @param {Any} defaultValue 默认值，当获取失败或已过期时返回
 * @returns {Any} 缓存的数据或默认值
 */
export const getCache = (key, defaultValue = null) => {
  if (!key) {
    console.error('缓存键名不能为空');
    return defaultValue;
  }

  try {
    const cacheStr = uni.getStorageSync(key);
    if (!cacheStr) return defaultValue;
    
    const cacheData = JSON.parse(cacheStr);
    
    // 检查是否过期（expire为0表示永不过期）
    if (cacheData.expire > 0 && cacheData.expire < Date.now()) {
      // 已过期，删除缓存并返回默认值
      removeCache(key);
      return defaultValue;
    }
    
    return cacheData.data;
  } catch (e) {
    console.error(`获取缓存失败: ${key}`, e);
    return defaultValue;
  }
};

/**
 * 移除缓存数据
 * @param {String} key 缓存键名
 * @returns {Boolean} 是否移除成功
 */
export const removeCache = (key) => {
  if (!key) {
    console.error('缓存键名不能为空');
    return false;
  }
  
  try {
    uni.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error(`移除缓存失败: ${key}`, e);
    return false;
  }
};

/**
 * 清除所有缓存数据
 * @returns {Boolean} 是否清除成功
 */
export const clearCache = () => {
  try {
    uni.clearStorageSync();
    return true;
  } catch (e) {
    console.error('清除所有缓存失败', e);
    return false;
  }
};

/**
 * 获取缓存信息
 * @returns {Object} 缓存信息对象，包含已用空间等
 */
export const getCacheInfo = () => {
  try {
    return uni.getStorageInfoSync();
  } catch (e) {
    console.error('获取缓存信息失败', e);
    return null;
  }
};

/**
 * 检查缓存键是否存在
 * @param {String} key 缓存键名
 * @returns {Boolean} 是否存在且未过期
 */
export const hasCache = (key) => {
  if (!key) return false;
  
  try {
    const cacheStr = uni.getStorageSync(key);
    if (!cacheStr) return false;
    
    const cacheData = JSON.parse(cacheStr);
    
    // 检查是否过期（expire为0表示永不过期）
    if (cacheData.expire > 0 && cacheData.expire < Date.now()) {
      // 已过期，删除缓存并返回false
      removeCache(key);
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 设置有效时间内不重复请求的缓存数据
 * 适用于短时间内可能重复请求相同接口的场景
 * @param {String} key 缓存键名
 * @param {Function} fetchFunction 获取数据的异步函数
 * @param {Number} expireTime 缓存有效期（毫秒）
 * @returns {Promise<Any>} 返回获取的数据
 */
export const cacheRequest = async (key, fetchFunction, expireTime = DEFAULT_EXPIRE_TIME) => {
  // 首先检查缓存中是否有数据且未过期
  const cachedData = getCache(key);
  if (cachedData !== null) {
    return cachedData;
  }
  
  // 无缓存或已过期，调用获取函数
  try {
    const data = await fetchFunction();
    // 将结果存入缓存
    setCache(key, data, expireTime);
    return data;
  } catch (error) {
    console.error(`请求数据失败: ${key}`, error);
    throw error;
  }
};

// Token相关方法
/**
 * 设置token
 * @param {String} token 身份令牌
 * @param {Number} expireTime 过期时间（毫秒）
 * @returns {Boolean} 是否设置成功
 */
export const setToken = (token, expireTime = 2 * 60 * 60 * 1000) => { // 默认2小时过期
  return setCache(CACHE_KEY.TOKEN, token, expireTime);
};

/**
 * 获取token
 * @returns {String|null} 身份令牌或null
 */
export const getToken = () => {
  return getCache(CACHE_KEY.TOKEN, null);
};

/**
 * 移除token
 * @returns {Boolean} 是否移除成功
 */
export const removeToken = () => {
  return removeCache(CACHE_KEY.TOKEN);
};

/**
 * 设置刷新token
 * @param {String} refreshToken 刷新令牌
 * @param {Number} expireTime 过期时间（毫秒）
 * @returns {Boolean} 是否设置成功
 */
export const setRefreshToken = (refreshToken, expireTime = 7 * 24 * 60 * 60 * 1000) => { // 默认7天过期
  return setCache(CACHE_KEY.REFRESH_TOKEN, refreshToken, expireTime);
};

/**
 * 获取刷新token
 * @returns {String|null} 刷新令牌或null
 */
export const getRefreshToken = () => {
  return getCache(CACHE_KEY.REFRESH_TOKEN, null);
};

export default {
  CACHE_KEY,
  setCache,
  getCache,
  removeCache,
  clearCache,
  getCacheInfo,
  hasCache,
  cacheRequest,
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken
}; 