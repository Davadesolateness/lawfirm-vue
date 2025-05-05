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

// 缓存管理器
class CacheManager {
  constructor() {
    this.prefix = 'user_';
    this.userPrefix = null;
    // 默认前缀，用于通用缓存（非用户特定的缓存）
    this.defaultPrefix = 'app_';
    // 存储当前活跃用户ID
    this.currentUserId = null;
  }

  // 设置当前用户前缀
  setUserPrefix(userId) {
    if (!userId) {
      console.warn('Warning: Setting user prefix with empty userId');
      this.clearUserPrefix();
      return;
    }
    this.userPrefix = `${this.prefix}${userId}_`;
    this.currentUserId = userId;
  }

  // 清除当前用户前缀
  clearUserPrefix() {
    this.userPrefix = null;
    this.currentUserId = null;
  }

  // 获取带前缀的key
  getPrefixedKey(key) {
    // 如果用户前缀未设置，使用默认前缀
    const prefix = this.userPrefix || this.defaultPrefix;
    return `${prefix}${key}`;
  }

  // 获取用户特定的token key
  getUserTokenKey(userId) {
    return `${this.prefix}${userId}_token`;
  }

  // 设置缓存，带过期时间
  setCache(key, value, expireTime = DEFAULT_EXPIRE_TIME) {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const cacheData = {
        value,
        expireTime: Date.now() + expireTime
      };
      uni.setStorageSync(prefixedKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // 获取缓存
  getCache(key, defaultValue = null) {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      console.log("prefixedKey为：" + prefixedKey)
      const cacheStr = uni.getStorageSync(prefixedKey);
      if (!cacheStr) return defaultValue;

      const cacheData = JSON.parse(cacheStr);
      
      // 检查是否过期
      if (Date.now() > cacheData.expireTime) {
        this.removeCache(key);
        return defaultValue;
      }

      return cacheData.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return defaultValue;
    }
  }

  // 移除缓存
  removeCache(key) {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      uni.removeStorageSync(prefixedKey);
      return true;
    } catch (error) {
      console.error('Cache remove error:', error);
      return false;
    }
  }

  // 清除当前用户的所有缓存
  clearUserCache() {
    try {
      if (!this.userPrefix) return false;
      
      const storageInfo = uni.getStorageInfoSync();
      const keys = storageInfo.keys;
      
      keys.forEach(key => {
        if (key.startsWith(this.userPrefix)) {
          uni.removeStorageSync(key);
        }
      });
      
      // 同时移除用户特定的token
      if (this.currentUserId) {
        this.removeToken(this.currentUserId);
      }
      
      this.clearUserPrefix();
      return true;
    } catch (error) {
      console.error('Clear user cache error:', error);
      return false;
    }
  }

  // 清除所有缓存
  clearAllCache() {
    try {
      uni.clearStorageSync();
      this.clearUserPrefix();
      return true;
    } catch (error) {
      console.error('Clear all cache error:', error);
      return false;
    }
  }

  // 设置token (与用户ID关联)
  setToken(token, userId = null, expireTime = 2 * 60 * 60 * 1000) {
    // 如果提供了userId，使用它；否则使用当前活跃用户ID
    const targetUserId = userId || this.currentUserId;
    
    if (targetUserId) {
      // 存储用户特定的token
      const tokenKey = this.getUserTokenKey(targetUserId);
      const cacheData = {
        value: token,
        expireTime: Date.now() + expireTime,
        userId: targetUserId
      };
      
      try {
        uni.setStorageSync(tokenKey, JSON.stringify(cacheData));
        
        // 同时记录最新登录的用户ID
        uni.setStorageSync('last_login_user_id', targetUserId);
        return true;
      } catch (error) {
        console.error('Token save error:', error);
        return false;
      }
    } else {
      // 如果没有用户ID，则无法关联存储
      console.warn('Cannot set token: No user ID available');
      return false;
    }
  }

  // 获取token (优先返回指定用户的token，其次是当前活跃用户的token，最后是最近登录用户的token)
  getToken(userId = null) {
    try {
      // 确定要查找的用户ID顺序
      const userIds = [];
      
      // 1. 如果提供了特定用户ID，首先查找它
      if (userId) userIds.push(userId);
      
      // 2. 然后查找当前活跃用户ID
      if (this.currentUserId && this.currentUserId !== userId) 
        userIds.push(this.currentUserId);
      
      // 3. 最后查找最近登录的用户ID
      const lastUserId = uni.getStorageSync('last_login_user_id');
      if (lastUserId && !userIds.includes(lastUserId)) 
        userIds.push(lastUserId);
      
      // 依次尝试获取各用户的token
      for (const id of userIds) {
        const tokenKey = this.getUserTokenKey(id);
        const tokenData = uni.getStorageSync(tokenKey);
        
        if (tokenData) {
          try {
            const parsedData = JSON.parse(tokenData);
            
            // 检查是否过期
            if (Date.now() > parsedData.expireTime) {
              // 过期，删除并继续
              uni.removeStorageSync(tokenKey);
              continue;
            }
            
            return parsedData.value;
          } catch (e) {
            // 解析错误，删除并继续
            uni.removeStorageSync(tokenKey);
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // 移除token (指定用户的或当前用户的)
  removeToken(userId = null) {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (targetUserId) {
        const tokenKey = this.getUserTokenKey(targetUserId);
        uni.removeStorageSync(tokenKey);
        
        // 如果移除的是最近登录用户的token，也清除该记录
        const lastUserId = uni.getStorageSync('last_login_user_id');
        if (lastUserId === targetUserId) {
          uni.removeStorageSync('last_login_user_id');
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Remove token error:', error);
      return false;
    }
  }
}

export const cacheManager = new CacheManager();

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
  return cacheManager.getCache(key) !== null;
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
  const cachedData = cacheManager.getCache(key);
  if (cachedData !== null) {
    return cachedData;
  }
  
  // 无缓存或已过期，调用获取函数
  try {
    const data = await fetchFunction();
    // 将结果存入缓存
    cacheManager.setCache(key, data, expireTime);
    return data;
  } catch (error) {
    console.error(`请求数据失败: ${key}`, error);
    throw error;
  }
};

// 导出简化接口
export default {
  CACHE_KEY,
  setCache: (key, value, expireTime) => cacheManager.setCache(key, value, expireTime),
  getCache: (key, defaultValue) => cacheManager.getCache(key, defaultValue),
  removeCache: (key) => cacheManager.removeCache(key),
  clearCache: () => cacheManager.clearAllCache(),
  getCacheInfo,
  hasCache,
  cacheRequest,
  setToken: (token, userId, expireTime) => cacheManager.setToken(token, userId, expireTime),
  getToken: (userId) => cacheManager.getToken(userId),
  removeToken: (userId) => cacheManager.removeToken(userId),
  setUserPrefix: (userId) => cacheManager.setUserPrefix(userId),
  clearUserPrefix: () => cacheManager.clearUserPrefix(),
  clearUserCache: () => cacheManager.clearUserCache()
}; 