"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const n=require("./common/vendor.js"),e={onLaunch:function(){console.log("App Launch")},onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide")}};function o(){return{app:n.createSSRApp(e)}}o().app.mount("#app");exports.createApp=o;
