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
    ['data-tg', 'Telegram 频道链接尚未配置']
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
