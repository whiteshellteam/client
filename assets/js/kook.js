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
