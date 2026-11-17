/* ==========================================================================
   WhiteShell · docs
   站点内已不再用弹窗展示文档：购买改为独立页面 buy.html，
   在线玩家用 KOOK 官方 widget。这里保留空对象，方便以后新增弹窗内容。
   ========================================================================== */
window.WS = window.WS || {};

window.WS.docs = {
  settings: {
    title: '设置',
    body: ''
      + '<div class="setting-row">'
      +   '<div>'
      +     '<p class="setting-name">深色模式</p>'
      +     '<p class="setting-desc">切换站点的亮色 / 深色外观</p>'
      +   '</div>'
      +   '<button class="switch" type="button" role="switch" aria-checked="false" aria-label="深色模式" data-theme-switch></button>'
      + '</div>'
  },

  other: {
    title: '其他问题',
    body: ''
      + '<p>如果上面的内容没有解决你的问题，可以加入官方频道提交工单，管理员会尽快处理。</p>'
      + '<p>提交时附上设备型号、系统版本和问题截图，能更快定位问题。</p>'
      + '<div class="modal-cta"><a class="btn-pill btn-blue" href="https://kook.vip/vp71ue" data-kook target="_blank" rel="noopener">前往 KOOK 频道</a></div>'
  }
};
