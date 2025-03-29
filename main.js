import App from './App'
import http from '@/utils/http'
import {setupMockInterceptor} from '@/mock/mock-interceptor'


// #ifndef VUE3
import Vue from 'vue'

App.mpType = 'app'
const app = new Vue({
    ...App
})
debugger
console.log("--------------" + process.env.NODE_ENV)
// 开发环境启用 Mock
if (process.env.NODE_ENV === 'development') {

    import('/mock/mock').then(() => {
        setupMockInterceptor()
    })
}

app.config.globalProperties.$http = http

app.mount("#app")
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
console.log("--------------" + process.env.NODE_ENV)
// 开发环境启用 Mock
if (process.env.NODE_ENV === 'development') {

    import('/mock/mock')
}

// #endif