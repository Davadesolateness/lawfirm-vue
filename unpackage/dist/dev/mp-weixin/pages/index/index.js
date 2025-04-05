"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_navigateTo = require("../../utils/navigateTo.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
if (!Math) {
  common_vendor.unref(LawyerList)();
}
const LawyerList = () => "../../components/lawyer/lawyerlist2.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function handleConsult(item) {
      utils_navigateTo.navigateToUrl("/components/lawyer/lawyerlist");
    }
    const services = common_vendor.ref([
      { icon: "staff", title: "智能匹配", desc: "律师/法务" },
      { icon: "phone", title: "电话快问", desc: "1分钟接通律师" },
      { icon: "medal", title: "专家咨询", desc: "执业10年以上律师" }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(services.value, (item, index, i0) => {
          return {
            a: "1cf27b2a-0-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "30",
              color: "#2979FF"
            }),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.desc),
            e: index
          };
        }),
        b: common_vendor.o(($event) => handleConsult())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
