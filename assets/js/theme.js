/* ==========================================================================
   WhiteShell · theme
   亮 / 暗主题切换。首屏防闪烁由 index.html 里的内联脚本负责，
   这里只负责按钮图标、aria 文案与主题色 meta。
   ========================================================================== */
(function (WS) {
  'use strict';

  var root = document.documentElement;
  var DARK_COLOR = '#131315';
  var LIGHT_COLOR = '#ffffff';

  /* 图标取自 Lucide（ISC 许可） */
  var ICON_SUN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  function syncIcons(theme) {
    var icon = theme === 'dark' ? ICON_SUN : ICON_MOON;
    var label = theme === 'dark' ? '切换到浅色' : '切换到深色';
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (btn) {
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-switch]'), function (el) {
      var on = theme === 'dark';
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);

    syncIcons(theme);

    setThemeColor(theme === 'dark' ? DARK_COLOR : LIGHT_COLOR);
  }

  /** 改写 theme-color：只更新属性，不做强制重排 */
  function setThemeColor(color) {
    var node = document.getElementById('themeColor');
    if (!node) return;
    node.setAttribute('content', color);
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
    sync: function () { syncIcons(current()); },
    toggle: toggle,
    init: function () {
      apply(root.getAttribute('data-theme') || 'dark');

      document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-theme-toggle], [data-theme-switch]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        toggle();
      });
    }
  };
})(window.WS);
