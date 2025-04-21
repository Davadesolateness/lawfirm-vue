/**
 * 通用工具函数
 * 提供常用的辅助方法
 */

/**
 * 格式化日期时间
 * @param {Date|String|Number} date 日期对象、时间戳或日期字符串
 * @param {String} format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {String} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  
  // 转换为Date对象
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  // 日期格式化映射
  const map = {
    YYYY: dateObj.getFullYear(),
    MM: String(dateObj.getMonth() + 1).padStart(2, '0'),
    DD: String(dateObj.getDate()).padStart(2, '0'),
    HH: String(dateObj.getHours()).padStart(2, '0'),
    mm: String(dateObj.getMinutes()).padStart(2, '0'),
    ss: String(dateObj.getSeconds()).padStart(2, '0'),
  };
  
  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, match => map[match]);
};

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 延迟时间(ms)
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay = 300) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {Number} interval 间隔时间(ms)
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, interval = 300) => {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 深拷贝对象
 * @param {Object|Array} obj 要拷贝的对象
 * @returns {Object|Array} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 处理日期对象
  if (obj instanceof Date) return new Date(obj);
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理普通对象
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

/**
 * 生成随机字符串
 * @param {Number} length 字符串长度
 * @returns {String} 随机字符串
 */
export const randomString = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * 获取URL参数
 * @param {String} url URL字符串
 * @returns {Object} 参数对象
 */
export const getUrlParams = (url) => {
  const params = {};
  const queryString = url.split('?')[1] || '';
  
  if (!queryString) return params;
  
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  
  return params;
};

/**
 * 判断对象是否为空
 * @param {Object} obj 要判断的对象
 * @returns {Boolean} 是否为空
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim() === '';
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

export default {
  formatDate,
  debounce,
  throttle,
  deepClone,
  randomString,
  getUrlParams,
  isEmpty
};

