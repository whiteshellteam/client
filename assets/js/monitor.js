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
