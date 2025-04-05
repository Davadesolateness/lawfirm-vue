"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const mock_mpAdapter = require("./mock/mp-adapter.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/user/user.js";
  "./pages/lawyer/lawyerinfo.js";
  "./pages/404/404.js";
  "./pages/index/index2.js";
  "./components/lawyer/lawyerlist.js";
  "./components/service/servicetype.js";
  "./pages/order/orderlist.js";
  "./pages/lawyer/addlawyerinfo.js";
  "./pages/lawyer/modifylawyerinfo.js";
  "./pages/user/modifyuserinfo.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:9", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
mock_mpAdapter.wxRequestInterceptor();
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
