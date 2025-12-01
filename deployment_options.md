# LyraNet 部署方案推荐

针对 LyraNet (Next.js 项目)，以下是几个最佳的免费部署方案。

## 1. Vercel (首选推荐)
Vercel 是 Next.js 的开发商，提供最完美的兼容性和开发体验。

*   **优点**:
    *   **零配置**: 连接 GitHub 仓库后自动识别 Next.js 项目，一键部署。
    *   **性能**: 全球边缘网络 (Edge Network)，速度极快。
    *   **功能**: 完美支持 Serverless Functions (API 路由)、图片优化、ISR 等 Next.js 高级特性。
    *   **预览环境**: 每次 Pull Request 都会自动生成预览链接，方便测试。
*   **缺点**:
    *   免费版仅限**个人非商业**用途。
    *   国内访问速度偶尔会有波动（但在可接受范围内）。
*   **适用场景**: 个人开发者、开源项目、追求极致开发体验。

## 2. Netlify
Netlify 是另一个非常流行的静态站点托管平台，对 Next.js 的支持也非常成熟。

*   **优点**:
    *   **免费额度大方**: 每月 100GB 带宽，300分钟构建时间。
    *   **功能丰富**: 自带表单处理、身份验证等插件。
    *   **回滚方便**: 可以一键回滚到任意历史版本。
*   **缺点**:
    *   国内访问速度通常不如 Vercel 或 Cloudflare。
*   **适用场景**: 需要更多集成功能（如表单）的项目。

## 3. Cloudflare Pages
依托 Cloudflare 强大的全球 CDN 网络。

*   **优点**:
    *   **速度最快**: 尤其是对于全球用户，节点覆盖最广。
    *   **完全免费**: 免费版不限带宽，不限请求数。
    *   **安全性**: 自带 Cloudflare 的 DDoS 防护。
*   **缺点**:
    *   **配置稍繁琐**: 部署 Next.js (特别是涉及服务端渲染/API时) 需要使用 `@cloudflare/next-on-pages` 进行适配。
    *   构建速度相对较慢。
*   **适用场景**: 追求极致访问速度、预计流量非常大的项目。

## 4. GitHub Pages
完全免费的静态托管服务。

*   **优点**:
    *   **完全免费**: 没有任何隐形费用。
    *   **代码同源**: 直接依托于 GitHub 仓库。
*   **缺点**:
    *   **仅支持静态**: 必须使用 `output: 'export'` 导出为纯静态 HTML/CSS/JS。
    *   **不支持服务端特性**: 无法使用 Next.js 的 API Routes、Image Optimization (需替换 Loader)、SSR 等功能。
    *   **配置**: 需要配置 GitHub Actions 才能实现自动化部署。
*   **适用场景**: 纯静态展示页，不需要任何后端逻辑。

---

## 💡 综合建议

对于 **LyraNet**：

1.  **最省心方案**: 选择 **Vercel**。
    *   直接去 [vercel.com](https://vercel.com) 注册 -> Import Project -> 选择你的 GitHub 仓库 -> Deploy。
    *   全程不需要写一行配置代码。

2.  **最高性能/不限流方案**: 选择 **Cloudflare Pages**。
    *   如果你担心流量很大，或者希望国内访问更快，Cloudflare 是很好的选择。

3.  **纯静态方案**: 如果你确定不使用任何服务端功能，可以选择 **GitHub Pages**。
    *   需要修改 `next.config.ts` 添加 `output: 'export'`。
