/* ==========================================================================
   WhiteShell · kook
   KOOK 频道引流卡片：首次进站 5 秒后从右下角弹出，展示服务器名称与在线人数。
   数据来自 KOOK 官方 widget 接口；接口不可用时回退到本地静态信息。
   关闭后 7 天不再打扰，点击加入后 30 天内不再打扰。
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
    invite_link: 'https://kook.vip/vp71ue'
  };

  var card = null;
  var timer = 0;

  function snoozed() {
    var until = parseInt(WS.storage.get(STORAGE_KEY) || '0', 10);
    return until > Date.now();
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

  function build(data) {
    var el = document.createElement('aside');
    el.className = 'kook-card';
    el.setAttribute('role', 'complementary');
    el.setAttribute('aria-label', '加入 KOOK 频道');

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
    title.textContent = '加入我们的 KOOK 频道';

    var meta = document.createElement('p');
    meta.className = 'kook-meta';
    var online = parseInt(data.online_count, 10);
    meta.textContent = (data.name || FALLBACK.name) + (online > 0 ? ' · ' + online + ' 人在线' : '');

    text.appendChild(title);
    text.appendChild(meta);

    var join = document.createElement('a');
    join.className = 'kook-join';
    join.href = data.invite_link || FALLBACK.invite_link;
    join.target = '_blank';
    join.rel = 'noopener';
    join.textContent = '加入';
    join.addEventListener('click', function () { dismiss(30); });

    var closeBtn = document.createElement('button');
    closeBtn.className = 'kook-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', '关闭');
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    closeBtn.addEventListener('click', function () { dismiss(7); });

    el.appendChild(icon);
    el.appendChild(text);
    el.appendChild(join);
    el.appendChild(closeBtn);
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
      .then(function (data) {
        return data && data.name ? data : FALLBACK;
      })
      .catch(function () {
        window.clearTimeout(abortTimer);
        return FALLBACK;
      });
  }

  WS.kook = {
    dismiss: dismiss,
    init: function () {
      if (snoozed()) return;
      fetchWidget().then(function (data) {
        if (snoozed()) return;
        timer = window.setTimeout(function () { show(data); }, DELAY);
      });
    }
  };
})(window.WS);
