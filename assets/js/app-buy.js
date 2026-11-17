/* ==========================================================================
   WhiteShell · app-buy
   购买页入口：只初始化轻提示与链接代理（店铺链接未配置时给出提示）。
   ========================================================================== */
(function (WS) {
  'use strict';

  function boot() {
    WS.cache.init();
    WS.toast.init();
    WS.links.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.WS);
