import App from './App'
import http from '@/utils/http'

// #ifndef VUE3
import Vue from 'vue'

App.mpType = 'app'
const app = new Vue({
    ...App
})

app.config.globalProperties.$http = http

app.mount("#app")
// #endif

// #ifdef H5 || APP
import { initMock } from '@/mock';
initMock();
// #endif

// #ifdef MP-WEIXIN
/*import { wxRequestInterceptor } from '@/mock/mp-adapter';
wxRequestInterceptor();*/
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}

// #endif