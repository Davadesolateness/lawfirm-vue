/**
 * 工具函数统一导出
 */

// 导入所有工具模块
import userManager from './userManager';
import cacheManager from './cacheManager';
import common from '../common';

// 导出所有模块
export {
  userManager,
  cacheManager,
  common
};

// 默认导出所有模块的合并对象
export default {
  ...userManager,
  ...cacheManager,
  ...common
}; 