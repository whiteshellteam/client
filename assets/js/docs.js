/* ==========================================================================
   WhiteShell · docs
   弹窗文案数据（当前只有「选购商品」）。
   想改文案只动这个文件，不用碰逻辑；新增条目只要 key 对应 data-doc 即可。
   ========================================================================== */
window.WS = window.WS || {};

window.WS.docs = {
  store: {
    title: '选购商品',
    body: ''
      + '<p>WhiteShell 提供模块授权与配套服务，具体商品、价格与活动以官方频道公告为准。</p>'
      + '<h4>一、购买方式</h4>'
      + '<p>请通过官方 KOOK 频道联系管理员下单。官方不会通过私聊或第三方店铺收款，请提高警惕、谨防诈骗。</p>'
      + '<h4>二、商品包含</h4>'
      + '<ul><li>WhiteShell 模块使用授权，含后续版本更新；</li><li>官方频道内的安装指导与问题排查；</li><li>可选的进阶配置与定制服务。</li></ul>'
      + '<h4>三、售后说明</h4>'
      + '<p>购买后如遇使用问题，可在官方频道提交工单，管理员会尽快协助处理。</p>'
      + '<div class="modal-cta"><a class="btn-pill btn-blue" href="https://kook.vip/vp71ue" data-kook target="_blank" rel="noopener">前往 KOOK 频道选购</a></div>'
  },

  other: {
    title: '其他问题',
    body: ''
      + '<p>如果上面的内容没有解决你的问题，可以加入官方频道提交工单，管理员会尽快处理。</p>'
      + '<p>提交时附上设备型号、系统版本和问题截图，能更快定位。</p>'
      + '<div class="modal-cta"><a class="btn-pill btn-blue" href="https://kook.vip/vp71ue" data-kook target="_blank" rel="noopener">前往 KOOK 频道</a></div>'
  }
};
