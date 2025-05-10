"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const mock_mpAdapter = require("./mock/mp-adapter.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
  "./pages/lawyer/lawyerinfo.js";
  "./pages/order/orderlist.js";
  "./pages/user/user.js";
  "./pages/admin/managepanel.js";
  "./pages/lawyer/modifylawyerinfo.js";
  "./pages/404/404.js";
  "./components/lawyer/lawyerlist.js";
  "./components/service/servicetype.js";
  "./pages/lawyer/addlawyerinfo.js";
  "./pages/user/modifyuserinfo.js";
  "./pages/user/adduserinfo/adduserinfo.js";
  "./components/consult-popup/consult-popup.js";
  "./pages/call/callpage.js";
  "./pages/login/register/register.js";
  "./pages/login/resetpassword.js";
  "./pages/lawyer/lawyer.js";
  "./pages/admin/admin.js";
  "./components/user/agreement.js";
  "./components/user/privacy.js";
  "./pages/about/meichen.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
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
