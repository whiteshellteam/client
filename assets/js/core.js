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
