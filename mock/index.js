import BetterMock from 'better-mock';
import { mockXHR } from 'better-mock/dist/mock.mp'; // 小程序专用模块

// 初始化配置
BetterMock.setup({
    timeout: '10-50', // 模拟网络延迟
    log: process.env.NODE_ENV === 'development' // 开发环境打印日志
});

// 覆盖 uni-app 各平台请求方法
const overrideRequest = () => {
    // #ifdef MP-WEIXIN
    BetterMock.mock(new mockXHR()); // 小程序专用拦截
    // #endif

    // #ifdef H5 || APP
   /* const originalRequest = uni.request;
    uni.request = function(config) {
        return BetterMock.mock(config, originalRequest);
    };*/
    // #endif
};

// 加载 Mock 规则
const loadMocks = () => {
    import("./modules/user");
    import("./modules/lawyer");
};

export const initMock = () => {
    overrideRequest();
    loadMocks();
};


