/**
 * 用户类型管理工具
 * 用于设置、获取和清除用户类型信息
 */

// 用户类型常量
export const USER_TYPES = {
    USER: 'user',     // 普通用户
    LAWYER: 'lawyer', // 律师用户
    ADMIN: 'admin'    // 管理员用户
};

// 存储用户信息
export const setUserInfo = (userInfo) => {
    if (!userInfo) return false;

    try {
        // 确保用户类型合法
        if (userInfo.userType && Object.values(USER_TYPES).includes(userInfo.userType)) {
            uni.setStorageSync('userInfo', userInfo);
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
        const userInfo = uni.getStorageSync('userInfo');
        return userInfo || null;
    } catch (e) {
        console.error('获取用户信息失败', e);
        return null;
    }
};

// 获取用户类型
export const getUserType = () => {
    try {
        const userInfo = uni.getStorageSync('userInfo');
        // 判断返回的用户类型并设置对应的用户角色
        if (userInfo && userInfo.userType) {
            if (userInfo.userType === 'corporate' || userInfo.userType === 'individual') {
                // 如果是法人客户或个人客户，设置为普通用户角色
                return USER_TYPES.USER
            } else if (userInfo.userType === 'lawyer') {
                // 如果是律师，设置为律师角色
                return USER_TYPES.LAWYER
            } else if (userInfo.userType === 'admin') {
                // 如果是管理员，设置为管理员角色
                return USER_TYPES.ADMIN;
            } else {
                // 默认为用户角色
                return USER_TYPES.USER
            }
        }
        return USER_TYPES.USER; // 默认为普通用户
    } catch (e) {
        console.error('获取用户类型失败', e);
        return USER_TYPES.USER; // 默认为普通用户
    }
};

// 设置用户类型
export const setUserType = (userType) => {
    if (!Object.values(USER_TYPES).includes(userType)) {
        console.error('用户类型无效');
        return false;
    }
    try {
        // 解析获取到的json数据
        const userInfo = uni.getStorageSync('userInfo') || {};
        userInfo.userType = userType;
        uni.setStorageSync('userInfo', userInfo);
        return true;
    } catch (e) {
        console.error('设置用户类型失败', e);
        return false;
    }
};

// 清除用户信息（登出）
export const clearUserInfo = () => {
    try {
        uni.removeStorageSync('userInfo');
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