// 判断字符串是否为合法 JSON
function isJSON(str) {
    if (typeof str !== "string") return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// 全局请求封装
const base_url = 'http://localhost:996'
// 请求超出时间
const timeout = 5000

// 需要修改token，和根据实际修改请求头
// 全局请求封装，返回一个 Promise
const service = (options) => {
    return new Promise((resolve, reject) => {
        store.commit("loading"); // 开启全局 loading 状态

        // 特殊处理：如果是登录验证码接口，清除本地缓存的 token
        if (options.url === "/login/captcha/captcha") {
            uni.removeStorageSync("token");
        }

        uni.request({
            url: base_url + options.url, // 拼接基础地址和接口地址
            method: options.method || "GET", // 默认请求方法为 GET
            data: options.data || options.params || {}, // 传递的参数
            dataType: options.dataType || "json", // 请求的数据类型，默认为 JSON
            responseType: options.responseType || "text", // 响应的数据类型
            timeout: timeout,
            header: {
                devtype: "app", // 自定义请求头
                rid: "tempTokenId-" + md5DigestAsHex(uni.getStorageSync("token")), // 加密 token
                token: uni.getStorageSync("token"), // 从本地缓存中获取 token
                ...getContentType(options) // 动态获取 Content-Type
            },
            // 请求成功回调
            success: (res) => {
                const code = res.data.code || 200; // 服务器返回的状态码，默认为 200
                const msg = errorCode[code] || res.data.msg || errorCode["default"]; // 错误信息提示

                if (code == 401) {
                    // 处理未授权的情况，弹出提示框并跳转到登录页
                    uni.showModal({
                        title: "提示",
                        content: msg,
                        showCancel: false,
                        success: (res) => {
                            if (res.confirm) {
                                uni.reLaunch({url: "/pages/login/index"});
                            }
                        }
                    });
                } else if (code == 500) {
                    // 处理服务器错误
                    uni.showToast({
                        title: msg,
                        icon: "none",
                        mask: true,
                        duration: 2000
                    });
                } else {
                    // 特殊处理：如果是登录接口，保存返回的 token
                    if (options.url === "/login/captcha/captcha") {
                        uni.setStorageSync("token", res.header.token);
                    }
                    // 根据响应类型返回数据
                    resolve(options.responseType === "arraybuffer" ? res : res.data);
                }
            },
            // 请求失败回调
            fail: (err) => {
                console.log(baseURL + options.url, err); // 打印错误日志
                reject(err); // 返回错误信息
            },
            // 请求完成后关闭 loading
            complete() {
                store.commit("loaded");
            }
        });
    });
};

export default service;