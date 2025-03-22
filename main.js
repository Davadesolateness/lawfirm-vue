import App from './App'
import router from './utils/route'
// #ifndef VUE3
import Vue from 'vue'
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.use(router)
app.mount()

Vue.prototype.$router = router;


// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif