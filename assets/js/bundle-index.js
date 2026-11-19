
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

/* ===== docs.js ===== */
/* ==========================================================================
   WhiteShell · docs
   站点内已不再用弹窗展示文档：购买改为独立页面 buy.html，
   在线玩家用 KOOK 官方 widget。这里保留空对象，方便以后新增弹窗内容。
   ========================================================================== */
window.WS = window.WS || {};

window.WS.docs = {
  settings: {
    title: '设置',
    body: ''
      + '<div class="setting-row">'
      +   '<div>'
      +     '<p class="setting-name">深色模式</p>'
      +     '<p class="setting-desc">切换站点的亮色 / 深色外观</p>'
      +   '</div>'
      +   '<button class="switch" type="button" role="switch" aria-checked="false" aria-label="深色模式" data-theme-switch></button>'
      + '</div>'
  },

  other: {
    title: '其他问题',
    body: ''
      + '<p>如果上面的内容没有解决你的问题，可以加入官方频道提交工单，管理员会尽快处理。</p>'
      + '<p>提交时附上设备型号、系统版本和问题截图，能更快定位问题。</p>'
      + '<div class="modal-cta"><a class="btn-pill btn-blue" href="https://kook.vip/vp71ue" data-kook target="_blank" rel="noopener">前往 KOOK 频道</a></div>'
  }
};

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

/* ===== theme.js ===== */
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

/* ===== nav.js ===== */
/* ==========================================================================
   WhiteShell · nav
   顶部导航：社区下拉菜单、移动端抽屉、抽屉内锚点平滑滚动。
   ========================================================================== */
(function (WS) {
  'use strict';

  var NAV_OFFSET = 52; // 顶部导航栏高度

  var dropdown = null;
  var dropdownBtn = null;
  var sheet = null;
  var menuBtn = null;

  function closeDropdown() {
    if (!dropdown || !dropdown.classList.contains('open')) return;
    dropdown.classList.remove('open');
    if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');
  }

  function isSheetOpen() {
    return !!(sheet && sheet.classList.contains('open'));
  }

  function setSheet(open) {
    if (!sheet) return;
    sheet.classList.toggle('open', open);
    if (menuBtn) {
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeSheet() {
    if (isSheetOpen()) setSheet(false);
  }

  function initDropdown() {
    dropdown = document.getElementById('cwrap');
    if (!dropdown) return;
    dropdownBtn = WS.$('.community-btn', dropdown);

    WS.on(dropdownBtn, 'click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) closeDropdown();
    });
  }

  function initSheet() {
    sheet = document.getElementById('sheet');
    menuBtn = document.getElementById('menuBtn');
    if (!sheet || !menuBtn) return;

    WS.on(menuBtn, 'click', function () {
      setSheet(!isSheetOpen());
    });
  }

  /** 顶部为纯色，向下滚动后切换为毛玻璃 */
  function initScrollState() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    function update() {
      nav.classList.toggle('is-scrolled', window.scrollY > 4);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /** 站内锚点：平滑滚动，同时保持地址栏干净（不残留 #faq 这类 hash） */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.length < 2) return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var fromSheet = !!(sheet && sheet.contains(link));
      if (fromSheet) setSheet(false);

      var jump = function () {
        var top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        if (location.hash) {
          history.replaceState(null, '', location.pathname + location.search);
        }
      };

      if (fromSheet) window.setTimeout(jump, 180);
      else jump();
    }, true);
  }

  WS.nav = {
    closeDropdown: closeDropdown,
    closeSheet: closeSheet,
    setSheet: setSheet,
    init: function () {
      initDropdown();
      initSheet();
      initAnchors();
      initScrollState();

      /* 进场时地址栏若残留 hash，滚到位置后清掉，避免复制出带 #faq 的链接 */
      if (location.hash) {
        window.setTimeout(function () {
          if (location.hash) history.replaceState(null, "", location.pathname + location.search);
        }, 300);
      }
    }
  };
})(window.WS);

/* ===== dialog.js ===== */
/* ==========================================================================
   WhiteShell · dialog
   站内弹窗：协议 / 选购商品（文案来自 docs.js）、在线玩家等动态内容，
   以及「资源加载异常」弹窗的关闭。
   ========================================================================== */
(function (WS) {
  'use strict';

  var modal = null;
  var titleEl = null;
  var bodyEl = null;
  var boxEl = null;

  function fill(title, html, bare) {
    if (!modal) return;
    modal.classList.toggle('is-bare', !!bare);
    if (title) titleEl.textContent = title;
    bodyEl.innerHTML = html;
    if (WS.theme && WS.theme.sync) WS.theme.sync();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (boxEl) boxEl.scrollTop = 0;
  }

  /** 打开 docs.js 里预置的弹窗 */
  function open(key) {
    var doc = WS.docs && WS.docs[key];
    if (!doc) return;
    fill(doc.title, doc.body);
  }

  /** 用自定义 HTML 打开同一个弹窗（在线玩家列表等动态内容） */
  function openContent(title, html, bare) {
    fill(title, html, bare);
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.classList.remove('is-bare');
    document.body.style.overflow = '';
  }

  function closeLog() {
    var logModal = document.getElementById('logModal');
    if (logModal) logModal.hidden = true;
  }

  WS.dialog = {
    open: open,
    openContent: openContent,
    close: close,
    closeLog: closeLog,
    init: function () {
      modal = document.getElementById('modal');
      if (!modal) return;
      titleEl = document.getElementById('modalTitle');
      bodyEl = document.getElementById('modalBody');
      boxEl = WS.$('.modal-box', modal);
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

/* ===== effects.js ===== */
/* ==========================================================================
   WhiteShell · effects
   滚动相关动效：分区入场（.rv）与首屏方块视差。
   开启「减少动态效果」时全部跳过。
   ========================================================================== */
(function (WS) {
  'use strict';

  /** 分区滚动入场 */
  function initReveal() {
    var items = WS.$$('.rv');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (item) { observer.observe(item); });
  }

  /** 首屏方块轻微视差 */
  function initParallax() {
    if (WS.reducedMotion()) return;

    var host = document.getElementById('heroVisual');
    var layer = host ? WS.$('.mc-showcase', host) : null;
    if (!layer) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var offset = Math.min(window.scrollY, window.innerHeight * 1.05) * 0.05;
        layer.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  WS.effects = {
    init: function () {
      initReveal();
      initParallax();
    }
  };
})(window.WS);

/* ===== monitor.js ===== */
/* ==========================================================================
   WhiteShell · monitor
   资源加载自检：图片 / 样式表 / 脚本 / 字体加载失败时，汇总到一个弹窗里，
   方便排查（仅在真的出错时出现）。
   ========================================================================== */
(function (WS) {
  'use strict';

  var CHECK_DELAY = 2500;

  var failures = [];
  var seen = {};

  function add(type, name, url) {
    var key = type + '|' + name + '|' + (url || '');
    if (seen[key]) return;
    seen[key] = true;
    failures.push({ type: type, name: name, url: url || '' });
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function show() {
    if (!failures.length) return;

    var modal = document.getElementById('logModal');
    var body = document.getElementById('logBody');
    var count = document.getElementById('logCount');
    if (!modal || !body || !count) return;

    body.innerHTML = failures.map(function (item) {
      return '<div class="log-item">'
        + '<span class="log-type">' + escapeHtml(item.type) + '</span>'
        + '<div class="log-name">' + escapeHtml(item.name) + '</div>'
        + (item.url ? '<div class="log-url">' + escapeHtml(item.url) + '</div>' : '')
        + '</div>';
    }).join('');

    count.textContent = failures.length;
    modal.hidden = false;

    try { console.warn('[WhiteShell] 资源加载失败 ' + failures.length + ' 项', failures); } catch (e) {}
  }

  function watchErrors() {
    window.addEventListener('error', function (event) {
      var target = event.target;
      if (!target || target === window || target === document) return;

      var tag = (target.tagName || '').toLowerCase();
      var url = target.src || target.href || target.currentSrc || '';
      var fileName = url ? url.split('/').pop().split('?')[0] : '';

      if (tag === 'img') {
        if (target.hasAttribute('data-optional')) return; // 第三方头像等非必需资源
        add('图片', target.alt || fileName || '未命名图片', url);
      }
      else if (tag === 'script') add('脚本', fileName || '未命名脚本', url);
      else if (tag === 'link') add('样式表', fileName || '未命名样式', url);
    }, true);
  }

  function checkFonts(done) {
    if (!document.fonts || !document.fonts.ready) {
      done();
      return;
    }
    document.fonts.ready.then(function () {
      try {
        document.fonts.forEach(function (font) {
          if (font.status !== 'error') return;
          var family = String(font.family || '未知字体').replace(/['"]/g, '');
          add('字体', family + ' ' + (font.weight || '400'), '');
        });
      } catch (e) {}
      done();
    }).catch(function () { done(); });
  }

  function checkLogo() {
    var logo = document.querySelector('img[src*="logo"]');
    if (logo && logo.complete && logo.naturalWidth === 0) {
      add('图片', '品牌 Logo', logo.src);
    }
  }

  WS.monitor = {
    init: function () {
      watchErrors();
      window.addEventListener('load', function () {
        setTimeout(function () {
          checkLogo();
          checkFonts(show);
        }, CHECK_DELAY);
      });
    }
  };
})(window.WS);

/* ===== kook.js ===== */
/* ==========================================================================
   WhiteShell · kook
   左下角引流浮层 + 「在线玩家」弹窗，数据都来自 KOOK 官方 widget 接口。
   浮层：首次进站 5 秒后出现，关闭后 7 天不再打扰，点加入后 30 天内不再打扰。
   ========================================================================== */
(function (WS) {
  'use strict';

  var API = 'https://kookapp.cn/api/guilds/7690149438214340/widget.json';
  var STORAGE_KEY = 'ws-kook-dismiss';
  var DELAY = 5000;
  var DAY = 864e5;

  var FALLBACK = {
    name: 'Minecraft中国版社区',
    icon: 'assets/img/icons/kook.png',
    online_count: '',
    invite_link: 'https://kook.vip/vp71ue',
    members: []
  };

  var card = null;
  var timer = 0;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function snoozed() {
    return parseInt(WS.storage.get(STORAGE_KEY) || '0', 10) > Date.now();
  }

  function remove() {
    if (!card) return;
    card.classList.remove('show');
    document.body.classList.remove('kook-open');
    window.clearTimeout(timer);
    var el = card;
    card = null;
    window.setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 260);
  }

  function dismiss(days) {
    WS.storage.set(STORAGE_KEY, String(Date.now() + days * DAY));
    remove();
  }

  /** 只收起浮层，不记录冷却（例如点开在线玩家时） */
  function hideNow() {
    window.clearTimeout(timer);
    remove();
  }

  /** 在线玩家弹窗：直接铺官方 widget，不额外加标题 */
  function openMembers(data) {
    if (!WS.dialog || !WS.dialog.openContent) return;

    var source = data || FALLBACK;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var src = 'https://www.kookapp.cn/widget?id=7690149438214340&theme=' + (dark ? 'dark' : 'light');

    var html = '<div class="kook-embed"><iframe src="' + src + '" width="350" height="500" '
      + 'allowtransparency="true" frameborder="0" scrolling="no" title="KOOK 频道"></iframe></div>'
      + '<div class="kook-dialog-foot"><a class="btn-pill kook-join-btn" href="'
      + escapeHtml(source.invite_link || FALLBACK.invite_link)
      + '" target="_blank" rel="noopener">加入 KOOK 频道</a></div>';

    WS.dialog.openContent('', html, true);
  }

  function build(data) {
    var online = parseInt(data.online_count, 10);

    var el = document.createElement('aside');
    el.className = 'kook-card';
    el.setAttribute('role', 'complementary');
    el.setAttribute('aria-label', '加入 KOOK 频道');

    /* 头部：图标 + 文案 + 关闭 */
    var head = document.createElement('div');
    head.className = 'kook-head';

    var icon = document.createElement('img');
    icon.className = 'kook-icon';
    icon.alt = '';
    icon.width = 40;
    icon.height = 40;
    icon.setAttribute('data-optional', '');
    icon.src = data.icon || FALLBACK.icon;
    icon.addEventListener('error', function () {
      if (icon.src.indexOf('icons/kook.png') === -1) icon.src = 'assets/img/icons/kook.png';
    });

    var text = document.createElement('div');
    text.className = 'kook-text';

    var title = document.createElement('p');
    title.className = 'kook-title';
    title.textContent = '加入我们的 KOOK 社区吧！';

    var meta = document.createElement('p');
    meta.className = 'kook-meta';
    meta.textContent = (data.name || FALLBACK.name) + (online > 0 ? ' · ' + online + ' 人在线' : '');

    text.appendChild(title);
    text.appendChild(meta);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'kook-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', '关闭');
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    closeBtn.addEventListener('click', function () { dismiss(7); });

    head.appendChild(icon);
    head.appendChild(text);
    head.appendChild(closeBtn);

    /* 操作区：查看在线玩家 + 加入 */
    var actions = document.createElement('div');
    actions.className = 'kook-actions';

    var view = document.createElement('button');
    view.className = 'kook-view';
    view.type = 'button';
    view.textContent = '查看在线玩家';
    view.addEventListener('click', function () {
      hideNow();
      openMembers(data);
    });

    var join = document.createElement('a');
    join.className = 'kook-join';
    join.href = data.invite_link || FALLBACK.invite_link;
    join.target = '_blank';
    join.rel = 'noopener';
    join.textContent = '加入';
    join.addEventListener('click', function () { dismiss(30); });

    actions.appendChild(view);
    actions.appendChild(join);

    el.appendChild(head);
    el.appendChild(actions);
    return el;
  }

  function show(data) {
    if (card || snoozed()) return;
    card = build(data);
    document.body.appendChild(card);
    document.body.classList.add('kook-open');
    window.requestAnimationFrame(function () {
      if (card) card.classList.add('show');
    });
  }

  function fetchWidget() {
    if (!window.fetch || !window.Promise) return Promise.resolve(FALLBACK);

    var controller = window.AbortController ? new AbortController() : null;
    var abortTimer = window.setTimeout(function () { if (controller) controller.abort(); }, 5000);

    return fetch(API, controller ? { signal: controller.signal } : {})
      .then(function (res) {
        window.clearTimeout(abortTimer);
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then(function (data) { return data && data.name ? data : FALLBACK; })
      .catch(function () {
        window.clearTimeout(abortTimer);
        return FALLBACK;
      });
  }

  WS.kook = {
    dismiss: dismiss,
    hide: hideNow,
    members: openMembers,
    init: function () {
      fetchWidget().then(function (data) {
        if (snoozed()) return;
        timer = window.setTimeout(function () { show(data); }, DELAY);
      });
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

/* ===== app.js ===== */
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
    WS.cache.init();
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
