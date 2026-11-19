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
