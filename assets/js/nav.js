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

    // 抽屉里的链接：先收起抽屉，锚点滚动交给下面的 initAnchors
    WS.$$('a', sheet).forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.getAttribute('href') === '#') {
          setTimeout(function () { setSheet(false); }, 80);
        } else {
          setSheet(false);
        }
      });
    });
  }

  function initAnchors() {
    if (!sheet) return;
    WS.$$('a[href^="#"]', sheet).forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.length < 2) return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        window.setTimeout(function () {
          var top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 180);
      }, true);
    });
  }

  WS.nav = {
    closeDropdown: closeDropdown,
    closeSheet: closeSheet,
    setSheet: setSheet,
    init: function () {
      initDropdown();
      initSheet();
      initAnchors();
    }
  };
})(window.WS);
