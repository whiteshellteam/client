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
