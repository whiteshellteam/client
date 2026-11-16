/* ==========================================================================
   WhiteShell · theme
   亮 / 暗主题切换。首屏防闪烁由 index.html 里的内联脚本负责，
   这里只负责按钮图标、aria 文案与主题色 meta。
   ========================================================================== */
(function (WS) {
  'use strict';

  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');

  var ICON_SUN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M20.4 14.7A8.5 8.5 0 1 1 9.3 3.6a7 7 0 0 0 11.1 11.1Z"/></svg>';

  var buttons = [];

  function apply(theme) {
    root.setAttribute('data-theme', theme);

    var icon = theme === 'dark' ? ICON_SUN : ICON_MOON;
    var label = theme === 'dark' ? '切换到浅色' : '切换到深色';

    buttons.forEach(function (btn) {
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
    });

    if (meta) meta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
  }

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    apply(next);
    WS.storage.set('ws-t', next);
  }

  WS.theme = {
    apply: apply,
    toggle: toggle,
    init: function () {
      buttons = WS.$$('[data-theme-toggle]');
      apply(root.getAttribute('data-theme') || 'dark');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          toggle();
        });
      });
    }
  };
})(window.WS);
