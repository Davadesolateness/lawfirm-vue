/**
 * 用户类型管理工具
 * 用于设置、获取和清除用户类型信息
 */
import cacheManager from './cacheManager';

// 用户类型常量
export const USER_TYPES = {
    INDIVIDUAL: 'individual', // 个人用户
    CORPORATE: 'corporate',   // 法人用户
    LAWYER: 'lawyer',         // 律师用户
    ADMIN: 'admin'            // 管理员用户
};

// 存储用户信息
export const setUserInfo = (userInfo) => {
    if (!userInfo) return false;

    try {
        // 确保用户类型合法
        if (userInfo.userType && (
            userInfo.userType === USER_TYPES.INDIVIDUAL || 
            userInfo.userType === USER_TYPES.CORPORATE || 
            userInfo.userType === USER_TYPES.LAWYER || 
            userInfo.userType === USER_TYPES.ADMIN
        )) {
            cacheManager.setCache('userInfo', userInfo);
            return true;
        } else {
            console.error('用户类型无效');
            return false;
        }
    } catch (e) {
        console.error('保存用户信息失败', e);
        return false;
    }
};

// 获取用户信息
export const getUserInfo = () => {
    try {
        const userInfo = cacheManager.getCache('userInfo');
        return userInfo || null;
    } catch (e) {
        console.error('获取用户信息失败', e);
        return null;
    }
};

// 获取用户类型
export const getUserType = () => {
    try {
        // 获取缓存中当前登录用户的id
        const userId = uni.getStorageSync('current_user_id');
        // 设置为用户前缀 获取该用户的缓存信息
        cacheManager.setUserPrefix(userId)
        const userInfo = cacheManager.getCache('userInfo');
        // 判断返回的用户类型
        if (userInfo && userInfo.userType) {
            if (userInfo.userType === USER_TYPES.INDIVIDUAL ||
                userInfo.userType === USER_TYPES.CORPORATE ||
                userInfo.userType === USER_TYPES.LAWYER ||
                userInfo.userType === USER_TYPES.ADMIN) {
                return userInfo.userType;
            }
        }
        return null; // 默认为null
    } catch (e) {
        console.error('获取用户类型失败', e);
        return null; // 默认为个人用户
    }
};

// 设置用户类型
export const setUserType = (userType) => {
    if (!(userType === USER_TYPES.INDIVIDUAL || 
          userType === USER_TYPES.CORPORATE || 
          userType === USER_TYPES.LAWYER || 
          userType === USER_TYPES.ADMIN)) {
        console.error('用户类型无效');
        return false;
    }
    
    try {
        // 获取当前用户信息，如果不存在则创建
        let userInfo = cacheManager.getCache('userInfo') || {};
        userInfo.userType = userType;
        cacheManager.setCache('userInfo', userInfo);
        return true;
    } catch (e) {
        console.error('设置用户类型失败', e);
        return false;
    }
};

// 清除用户信息（登出）
export const clearUserInfo = () => {
    try {
        cacheManager.removeCache('userInfo');
        return true;
    } catch (e) {
        console.error('清除用户信息失败', e);
        return false;
    }
};

export default {
    USER_TYPES,
    setUserInfo,
    getUserInfo,
    getUserType,
    setUserType,
    clearUserInfo
}; 