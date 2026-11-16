# WhiteShell 官网

《我的世界》中国版辅助工具 WhiteShell 的官方网站，纯静态、零构建、零第三方依赖。

## 目录结构

```
.
├── index.html              # 首页（只有结构，样式/脚本全部外链）
├── 404.html                # 404 页
├── assets
│   ├── css
│   │   ├── tokens.css      # 设计变量：颜色、字体栈、圆角、动效曲线（亮/暗两套）
│   │   ├── fonts.css       # @font-face：Inter / JetBrains Mono 自托管字体
│   │   ├── base.css        # 重置、排版基线、焦点样式、页宽容器
│   │   ├── layout.css      # 页面骨架：光晕背景、导航、抽屉、首屏、方块、分区、页脚
│   │   ├── components.css  # 组件：按钮、图标按钮、下拉菜单、卡片、FAQ、CTA、弹窗、提示条
│   │   ├── motion.css      # 关键帧与滚动入场
│   │   ├── responsive.css  # 断点适配 + prefers-reduced-motion
│   │   └── pages.css       # 独立页面（404）
│   ├── js
│   │   ├── core.js         # window.WS 命名空间与工具函数
│   │   ├── docs.js         # 弹窗文案数据（选购商品）
│   │   ├── toast.js        # 底部轻提示
│   │   ├── theme.js        # 亮/暗主题切换
│   │   ├── nav.js          # 下拉菜单、移动端抽屉、锚点滚动
│   │   ├── dialog.js       # 弹窗开关
│   │   ├── links.js        # 全站点击代理（data-* 链接、缓存戳、其他问题）
│   │   ├── effects.js      # 分区入场、首屏视差
│   │   ├── monitor.js      # 资源加载失败自检弹窗
│   │   └── app.js          # 入口：按顺序初始化 + 全局快捷键
│   ├── fonts               # 自托管字体（Inter 变量字体、JetBrains Mono）
│   └── img                 # 品牌 Logo 与方块素材
└── .nojekyll               # 让 GitHub Pages 跳过 Jekyll
```

## 本地预览

直接双击 `index.html` 即可（所有路径都是相对的，`file://` 也能正常打开）。

## 常见修改

| 想改什么 | 改哪里 |
| --- | --- |
| 主色、圆角、字体栈 | `assets/css/tokens.css` |
| 导航、首屏、页脚结构 | `index.html` + `assets/css/layout.css` |
| 按钮、卡片、弹窗样式 | `assets/css/components.css` |
| 选购商品文案 | `assets/js/docs.js` |
| 下载、KOOK、Telegram 链接 | 把对应 `href="#"` 换成真实链接即可（未配置时点击会弹提示） |
| 右侧方块 | 换 `assets/img/blocks/` 里的图，或改 `index.html` 里 `.mc-block` 的 `src` |
| 断点与移动端细节 | `assets/css/responsive.css` |

## 部署

推送到 `main` 分支，GitHub Pages 会自动发布到 <https://whiteshellteam.github.io/client/>。
