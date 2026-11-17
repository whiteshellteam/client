/* ==========================================================================
   WhiteShell · app
   入口：按依赖顺序初始化各模块，并处理全局快捷键与浏览器默认行为。
   ========================================================================== */
(function (WS) {
  'use strict';

  /** 移动端关闭长按菜单、多指缩放等干扰行为 */
  function lockGestures() {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('selectstart', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });

    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (type) {
      document.addEventListener(type, function (e) { e.preventDefault(); }, { passive: false });
    });

    document.addEventListener('touchmove', function (e) {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  function bindEscape() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      WS.nav.closeDropdown();
      WS.nav.closeSheet();
      WS.dialog.close();
      WS.dialog.closeLog();
      if (WS.kook) WS.kook.dismiss(7);
    });
  }

  function boot() {
    WS.toast.init();
    WS.theme.init();
    WS.nav.init();
    WS.dialog.init();
    WS.links.init();
    WS.effects.init();
    WS.monitor.init();
    WS.kook.init();
    lockGestures();
    bindEscape();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.WS);
