/* ==========================================================================
   WhiteShell · dialog
   协议 / 选购商品弹窗，以及「资源加载异常」弹窗的关闭。
   文案来自 docs.js，这里只处理开关逻辑。
   ========================================================================== */
(function (WS) {
  'use strict';

  var modal = null;
  var titleEl = null;
  var bodyEl = null;
  var boxEl = null;

  function open(key) {
    var doc = WS.docs && WS.docs[key];
    if (!doc || !modal) return;

    titleEl.textContent = doc.title;
    bodyEl.innerHTML = doc.body;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (boxEl) boxEl.scrollTop = 0;
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function closeLog() {
    var logModal = document.getElementById('logModal');
    if (logModal) logModal.hidden = true;
  }

  WS.dialog = {
    open: open,
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
