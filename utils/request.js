import axios from "axios";
import { Message } from "@element-plus";
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    // baseURL:
    timeout: 60000 // request timeout
});
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}
service.defaults.withCredentials = true;

// request interceptor
service.interceptors.request.use(
    (config) => {

        if(!config.data){
            config.data = userInfo
        }
        if(config.data&&isJSON(config.data)){
            config.data=JSON.parse(config.data)
        }
        if(config.data){
            config.data = Object.assign(config.data,userInfo)
        }
        if(config.data&&config.data.dwrParam){
            config.data.dwrParam = Object.assign(config.data.dwrParam,userInfo)
        }

        config.headers = {
            //Authorization: getToken(),
            requestId: uuidv4(),
            "Content-Type": config.headers["Content-Type"] !== undefined ? config.headers["Content-Type"] : "application/json"
        };
        return config;
    },
    (error) => {
        // Do something with request error
        Promise.reject(error);
    }
);
// response interceptor
service.interceptors.response.use(
    // response => response,
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    (response) => {



        if (response.headers.status === '0') {
            if (response.headers.newJwt) {
                // window.sessionStorage.token = response.headers.newJwt;
                setJwtToken(response.headers.newJwt);
                setToken(response.headers.newJwt);
            }
        }
        // 返回状态码为16，清除token，退出登陆
        if (response.headers.status === '16') {
            if (getOtherCookie('isSSO')) {
                new Vue().$confirm("登录用户已失效，请重新登录！", "友情提示", {
                    dangerouslyUseHTMLString: true, // 必填
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    roundButton: true, // 必填
                    type: 'error', // 必填
                    customClass: 'picc-message-box', // 必填
                    center: true,
                    showClose: false
                }).then(() => {
                    clearCookies();
                    window.location.href = getOtherCookie('redirectUrl');
                    return true;
                }).catch(() => {
                    clearCookies();
                    window.location.href = getOtherCookie('redirectUrl');
                    return false;
                });
            } else {
                new Vue().$confirm("登录用户已失效，请重新登录！", "友情提示", {
                    dangerouslyUseHTMLString: true, // 必填
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    roundButton: true, // 必填
                    type: 'error', // 必填
                    customClass: 'picc-message-box', // 必填
                    center: true,
                    showClose: false
                }).then(() => {
                    clearCookies();
                    window.location.href = getOtherCookie('redirectUrl');
                    return true;
                }).catch(() => {
                    clearCookies();
                    window.location.href = getOtherCookie('redirectUrl');
                    return false;
                });
            }
        }
        // 统一门户jwt认证 结束
        const res = response.data;
        // 灰度接口
        const { code, data } = response.data;
        if (code === "0" && data) {
            return data;
        }
        if (res.status !== 0) {
            return Promise.reject(res);
        }
        if (res.data) {
            return res;
        } else {
            return response.data;
        }
    },
    (error) => {
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });

        return Promise.reject(error);
    }
);

export default service;
