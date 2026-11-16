/* ==========================================================================
   WhiteShell · toast
   底部轻提示（Sonner 风格）。同一时间只显示一条。
   ========================================================================== */
(function (WS) {
  'use strict';

  var DURATION = 2600;

  var el = null;
  var timer = 0;

  function show(message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () {
      el.classList.remove('show');
    }, DURATION);
  }

  WS.toast = {
    show: show,
    hide: function () {
      if (!el) return;
      clearTimeout(timer);
      el.classList.remove('show');
    },
    init: function () {
      el = document.getElementById('toast');
    }
  };
})(window.WS);
