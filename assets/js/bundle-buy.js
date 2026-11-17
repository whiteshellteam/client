
/* ===== core.js ===== */
/* ==========================================================================
   WhiteShell · core
   命名空间与通用工具，其余模块都挂在 window.WS 下。
   ========================================================================== */
window.WS = window.WS || {};

(function (WS) {
  'use strict';

  /** 查询单个元素 */
  WS.$ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  /** 查询元素列表（返回真数组，方便 forEach） */
  WS.$$ = function (selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  };

  /** 事件绑定（目标不存在时静默跳过） */
  WS.on = function (target, type, handler, options) {
    if (target) target.addEventListener(type, handler, options);
  };

  /** 是否开启了「减少动态效果」 */
  WS.reducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  /** localStorage 安全封装（隐私模式 / 禁用存储时不报错） */
  WS.storage = {
    get: function (key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) {}
    }
  };
})(window.WS);

/* ===== links.js ===== */
/* ==========================================================================
   WhiteShell · links
   全站链接的点击代理：
   · data-dl / data-kook / data-tg 未配置时给出提示
   · data-doc 打开对应弹窗
   · data-close / data-log-close 关闭弹窗
   · data-bust 给下载链接加时间戳避免缓存
   · 「其他问题」跳转提示
   ========================================================================== */
(function (WS) {
  'use strict';

  var PLACEHOLDERS = [
    ['data-dl', '下载链接尚未配置'],
    ['data-kook', 'KOOK 频道链接尚未配置'],
    ['data-tg', 'Telegram 频道链接尚未配置'],
    ['data-shop1', '店铺 ① 链接尚未配置'],
    ['data-shop2', '店铺 ② 链接尚未配置']
  ];

  /** 给带 data-bust 的下载链接加 ?v=时间戳，防止旧缓存 */
  function applyCacheBust() {
    var bust = Date.now().toString(36);

    WS.$$('a[data-bust]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      try {
        var url = new URL(href, location.href);
        url.searchParams.set('v', bust);
        link.setAttribute('href', url.href);
      } catch (e) {}
    });
  }

  function handleClick(e) {
    // 1. 未配置的外部链接
    for (var i = 0; i < PLACEHOLDERS.length; i++) {
      var hit = e.target.closest('[' + PLACEHOLDERS[i][0] + ']');
      if (!hit) continue;

      var href = hit.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        WS.toast.show(PLACEHOLDERS[i][1]);
      }
      return;
    }

    // 2. 协议 / 商品弹窗
    var docTrigger = e.target.closest('[data-doc]');
    if (docTrigger) {
      e.preventDefault();
      WS.dialog.open(docTrigger.getAttribute('data-doc'));
      WS.nav.closeSheet();
      return;
    }

    // 3. 关闭按钮
    if (e.target.closest('[data-close]')) WS.dialog.close();
    if (e.target.closest('[data-log-close]')) WS.dialog.closeLog();
  }

  function initFaqOther() {
    var summary = WS.$('.faq-other summary');
    if (!summary) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      WS.dialog.open('other');
    });
  }

  WS.links = {
    init: function () {
      applyCacheBust();
      document.addEventListener('click', handleClick);
      initFaqOther();
    }
  };
})(window.WS);

/* ===== toast.js ===== */
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

/* ===== cache.js ===== */
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

/* ===== app-buy.js ===== */
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
