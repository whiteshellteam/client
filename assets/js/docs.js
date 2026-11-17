/* ==========================================================================
   WhiteShell · docs
   弹窗文案数据（当前只有「选购商品」）。
   想改文案只动这个文件，不用碰逻辑；新增条目只要 key 对应 data-doc 即可。
   ========================================================================== */
window.WS = window.WS || {};

window.WS.docs = {
  store: {
    title: '购买',
    body: ''
      + '<p>支持官方店铺与扫码支付两种方式，扫码支付 0 手续费，推荐优先使用。</p>'
      + '<h4>官方店铺 ①</h4>'
      + '<p>通过电商平台下单，价格已含平台佣金。</p>'
      + '<div class="modal-cta"><a class="btn-pill btn-blue" href="#" data-shop1 target="_blank" rel="noopener">前往店铺 ①</a></div>'
      + '<h4>官方店铺 ②</h4>'
      + '<p>备用店铺，平台手续费较高，实际到手价会略贵一些，建议优先选择店铺 ① 或扫码支付。</p>'
      + '<div class="modal-cta"><a class="btn-pill btn-fill" href="#" data-shop2 target="_blank" rel="noopener">前往店铺 ②</a></div>'
      + '<h4>扫码支付（0 手续费）</h4>'
      + '<p>微信或支付宝扫码付款，付款时请务必在备注里填写你的联系方式（QQ / 微信 / 邮箱），方便对账与开通。</p>'
      + '<div class="pay-qr">'
      +   '<figure class="pay-qr-item"><div class="pay-qr-box">二维码待上传</div><figcaption>微信支付</figcaption></figure>'
      +   '<figure class="pay-qr-item"><div class="pay-qr-box">二维码待上传</div><figcaption>支付宝</figcaption></figure>'
      + '</div>'
      + '<p class="pay-note">付款完成后把支付截图和备注信息发到官方频道，管理员看到后会尽快为你开通。</p>'
  }
};
