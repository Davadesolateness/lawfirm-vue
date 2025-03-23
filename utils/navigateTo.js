// utils/navigate.js

/**
 * 封装跳转方法
 * @param {Object} options 跳转参数
 * @param {string} options.url 跳转路径（支持绝对路径和相对路径）
 * @param {Object} [options.params={}] 跳转参数
 * @param {Function} [options.success] 跳转成功回调
 * @param {Function} [options.fail] 跳转失败回调
 * @param {boolean} [options.checkLogin=false] 是否需要登录验证
 */

function navigateCheck(options) {
    const {
        url,
        params = {},
        success,
        fail,
        checkLogin = false
    } = options;

    /*  // 0. 登录验证（根据业务逻辑实现）
      if (checkLogin && !isLogin()) {
          // 未登录跳转到登录页，携带当前页面路径作为回调
          uni.redirectTo({
              url: `/pages/login/login?redirect=${encodeURIComponent(url)}`
          });
          return;
      }*/

    // 1. 处理路径格式（支持相对路径）
    let formattedUrl = url.startsWith('/') ? url : `/${url}`;
    formattedUrl = formattedUrl.replace(/^\.\.?\/|\/\.\.?/g, ''); // 去除潜在的路径注入风险

    // 2. 参数序列化（优化参数处理逻辑）
    const serializeParams = (inputParams) => {
        return Object.keys(inputParams)
            .map(key => {
                const value = inputParams[key];
                return `${key}=${encodeURIComponent(
                    typeof value === 'object' ? JSON.stringify(value) : value
                )}`;
            })
            .join('&');
    };
    const query = serializeParams(params);

    if (query) {
        formattedUrl += (formattedUrl.includes('?') ? '&' : '?') + query;
    }

    // 3. 添加公共参数（如渠道、版本号等）
    const publicParams = {
        channel: 'H5',
        timestamp: Date.now()
    };
    // 检查是否已存在同名参数，避免覆盖
    const existingKeys = new Set(formattedUrl.split('?')[1]?.split('&').map(param => param.split('=')[0]) || []);
    const filteredPublicParams = Object.fromEntries(
        Object.entries(publicParams).filter(([key]) => !existingKeys.has(key))
    );

    if (Object.keys(filteredPublicParams).length > 0) {
        const publicQuery = serializeParams(filteredPublicParams);
        formattedUrl += (formattedUrl.includes('?') ? '&' : '?') + publicQuery;
    }
    return formattedUrl
}

export const navigateToUrl = (url) => {
    navigateTo({
        url: url
    })
};

export const navigateTo = (options) => {
    const formattedUrl = navigateCheck(options);
    if (!formattedUrl) {
        console.warn('跳转中断，用户未登录或路径无效');
        return;
    }
    // 4. 执行跳转
    uni.navigateTo({
        url: formattedUrl,
        success: (res) => {
            /*success && success(res);
            logEvent('page_view', {url}); // 埋点示例*/
        },
        fail: (err) => {
/*
            fail && fail(err);
*/
            console.error('跳转失败:', err);
            uni.showToast({title: '页面加载失败', icon: 'none'});

            // 补充失败处理逻辑（可选）
            // 例如：跳转到默认页面或重试
            // uni.redirectTo({ url: '/pages/error/error' });
        }
    });
};

/**
 * 关闭当前页面跳转
 * @param {String} url 必填，跳转路径
 */
export const redirectTo = (options) => {
    const formattedUrl = navigateCheck(options);
    if (!formattedUrl) {
        console.warn('跳转中断，用户未登录或路径无效');
        return;
    }
    // 4. 执行跳转
    uni.redirectTo({
        url: formattedUrl,
        success: (res) => {
            /*  success && success(res);
              logEvent('page_view', {url}); // 埋点示例*/
        },
        fail: (err) => {
/*
               fail && fail(err);
*/
            console.error('跳转失败:', err);
            uni.showToast({title: '页面加载失败', icon: 'none'});

            // 补充失败处理逻辑（可选）
            // 例如：跳转到默认页面或重试
            // uni.redirectTo({ url: '/pages/error/error' });
        }
    });
};

/**
 * 关闭所有页面跳转
 * @param {String} url 必填，跳转路径
 */
export const reLaunch = (options) => {
    const formattedUrl = navigateCheck(options);
    if (!formattedUrl) {
        console.warn('跳转中断，用户未登录或路径无效');
        return;
    }
    // 4. 执行跳转
    uni.reLaunch({
        url: formattedUrl,
        success: (res) => {
            success && success(res);
            logEvent('page_view', {url}); // 埋点示例
        },
        fail: (err) => {
            fail && fail(err);
            console.error('跳转失败:', err);
            uni.showToast({title: '页面加载失z败', icon: 'none'});

            // 补充失败处理逻辑（可选）
            // 例如：跳转到默认页面或重试
            // uni.redirectTo({ url: '/pages/error/error' });
        }
    });
};

/*
// 登录状态检查（示例）
const isLogin = () => {
    return !!uni.getStorageSync('token');
}

// 埋点上报（示例）
const logEvent = (eventName, data) => {
    // 实现埋点逻辑...
}*/

export default {navigateTo, redirectTo, reLaunch, navigateToUrl}