/* ==========================================================================
   WhiteShell · cache
   GitHub Pages 对 HTML 和静态资源都下发 Cache-Control: max-age=600，
   刚发布的改动最多要 10 分钟才生效。这里用两层保险规避：
   1) 站内 .html 链接自动追加 _=<时间戳>，打开的一定是服务端最新页面；
   2) 版本自检：本页 HTML 里记录的 build 与 assets/version.json 不一致时，
      自动强制刷新一次（每个版本只刷一次，不会死循环）。
   ========================================================================== */
(function (WS) {
  'use strict';

  var RELOAD_KEY = 'ws-build-seen';

  function bustInternalLinks() {
    document.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el.tagName !== 'A') el = el.parentNode;
      if (!el || !el.getAttribute) return;

      var href = el.getAttribute('href');
      if (!href) return;
      if (/^(https?:|mailto:|tel:|#|\/\/)/.test(href)) return;  // 外链 / 锚点 / 协议链接
      if (!/\.html($|[?#])/.test(href)) return;                  // 只处理页面链接
      if (/[?&]_=/.test(href)) return;                           // 已经带过时间戳

      var sep = href.indexOf('?') >= 0 ? '&' : '?';
      e.preventDefault();
      location.href = href + sep + '_=' + Date.now();
    }, true);
  }

  function checkBuild() {
    var meta = document.querySelector('meta[name="ws-build"]');
    if (!meta || !window.fetch) return;

    var build = meta.getAttribute('content');
    if (!build) return;

    fetch('assets/version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.v || data.v === build) return;
        try {
          if (sessionStorage.getItem(RELOAD_KEY) === data.v) return;
          sessionStorage.setItem(RELOAD_KEY, data.v);
        } catch (e) {}
        location.reload();
      })
      .catch(function () {});
  }

  WS.cache = {
    init: function () {
      bustInternalLinks();
      checkBuild();
    }
  };
})(window.WS);
