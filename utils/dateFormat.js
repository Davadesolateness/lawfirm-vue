/**
 * 日期格式化工具
 * 使用dayjs库提供更强大的日期处理功能
 */
import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param {Date|String|Number} date 日期对象、时间戳或日期字符串
 * @param {String} format 格式化模板，默认'YYYY-MM-DD'
 * @returns {String} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 * @param {Date|String|Number} date 日期对象、时间戳或日期字符串
 * @param {String} format 格式化模板，默认'YYYY-MM-DD HH:mm:ss'
 * @returns {String} 格式化后的日期时间字符串
 */
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 获取相对时间（如：3天前，刚刚）
 * @param {Date|String|Number} date 日期对象、时间戳或日期字符串
 * @returns {String} 相对时间字符串
 */
export const fromNow = (date) => {
  if (!date) return '';
  
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  
  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  
  const diffHours = now.diff(target, 'hour');
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = now.diff(target, 'day');
  if (diffDays < 30) return `${diffDays}天前`;
  
  const diffMonths = now.diff(target, 'month');
  if (diffMonths < 12) return `${diffMonths}个月前`;
  
  return `${now.diff(target, 'year')}年前`;
};

/**
 * 计算两个日期之间的差值
 * @param {Date|String|Number} date1 第一个日期
 * @param {Date|String|Number} date2 第二个日期
 * @param {String} unit 单位（'day', 'month', 'year'等）
 * @returns {Number} 差值
 */
export const dateDiff = (date1, date2, unit = 'day') => {
  return dayjs(date1).diff(dayjs(date2), unit);
};

export default {
  formatDate,
  formatDateTime,
  fromNow,
  dateDiff
}; 