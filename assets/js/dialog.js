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
