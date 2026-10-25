# 连腾辉 · 个人简历网站

纯 HTML / CSS / JavaScript，无构建依赖，支持 GitHub Pages 的 `/resume/` 子路径。

## 本地查看

在此目录运行 `python -m http.server 8000`，访问 http://localhost:8000 。也可以直接打开 index.html（复制微信需要安全上下文）。

## GitHub Pages

将 index.html、style.css、app.js、assets/ 和 .nojekyll 提交到仓库。仓库 Settings → Pages → Build and deployment 选择 Deploy from a branch，选择 main 分支、/(root)，保存。

预期地址：https://zhe-shi-lth.github.io/resume/ （以 GitHub Pages 实际显示地址为准）。

## 内容维护

- index.html：个人资料、项目、实习、教育。
- style.css：视觉样式、移动适配和减少动态效果设置。
- app.js：方向切换、PDF 下载、滚动浮现与复制微信。
- assets/resume-ai.pdf、resume-java.pdf、resume-fullstack.pdf：三种方向简历。

个人资料采用最新 AI 简历：用友实习结束于 2026.09；旧版 PDF 中仍有“至今”的表述，下载文件保留用户提供原稿。
项目示意为网页绘制的架构图，并非实际产品截图；未编造项目源码或演示地址。

部署后 PDF、手机、邮箱与微信会公开展示。网站无后台或在线模型调用。
