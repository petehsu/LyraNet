<div align="center">
  <img src="public/icon.svg" width="120" alt="LyraNet Logo" />
  <h1>LyraNet</h1>
</div>

**LyraNet** is a modern, comprehensive network environment analysis tool designed to provide users with deep insights into their network connection. It combines real-time IP analysis, risk assessment, and performance testing into a single, beautiful interface.

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🇬🇧 English

### Overview
LyraNet (formerly NetGuard) offers a professional-grade dashboard for monitoring your network status. It detects potential security risks, analyzes your IP reputation, and provides actionable suggestions to improve your online privacy and performance.

### Key Features
- **Real-time IP Analysis**: Detailed information about your IP address, ISP, ASN, and location.
- **Risk Assessment**: Intelligent scoring system that evaluates your network security based on IP type (Residential/Datacenter), Proxy/VPN usage, and DNS leaks.
- **Smart Speed Test**: Auto-starting speed test with intelligent server selection and route optimization simulation.
- **Privacy Checks**:
  - **WebRTC Leak Detection**: Identifies potential IP leaks via WebRTC and recommends protection tools.
  - **DNS Leak Test**: Verifies if your DNS queries are being exposed.
  - **Browser Fingerprinting**: Analyzes your browser's uniqueness and consistency.
- **GPS & Location**: Verifies consistency between your physical GPS location and IP location to detect spoofing.
- **Modern UI/UX**: A sleek, bento-grid layout designed for a single-page view without scrolling, featuring glassmorphism effects and smooth animations.

### Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: CSS Modules with CSS Variables (No Tailwind)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `ua-parser-js` for user agent parsing.

### Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/LyraNet.git
    cd LyraNet
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

---

<a name="chinese"></a>
## 🇨🇳 中文

### 简介
**LyraNet** 是一款现代化的综合网络环境分析工具，旨在为用户提供深度的网络连接洞察。它将实时 IP 分析、风险评估和性能测试集成在一个精美的界面中。

### 核心功能
- **实时 IP 分析**：提供关于您的 IP 地址、运营商 (ISP)、ASN 和地理位置的详细信息。
- **风险评估**：基于 IP 类型（住宅/机房）、代理/VPN 使用情况和 DNS 泄露等因素的智能评分系统。
- **智能测速**：自动启动的速度测试，包含智能服务器选择和路由优化模拟。
- **隐私检测**：
  - **WebRTC 泄露检测**：识别通过 WebRTC 可能导致的 IP 泄露，并推荐保护工具（如 WebRTC Network Limiter）。
  - **DNS 泄露测试**：验证您的 DNS 查询是否被暴露。
  - **浏览器指纹**：分析您浏览器的唯一性和一致性。
- **GPS 与定位**：验证您的物理 GPS 位置与 IP 位置的一致性，以检测位置欺诈。
- **现代 UI/UX**：时尚的 Bento 网格布局，专为单页视图设计，无滚动，具有玻璃拟态效果和流畅的动画。

### 技术栈
- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: CSS Modules + CSS Variables (未使用 Tailwind)
- **图标**: [Lucide React](https://lucide.dev/)
- **工具**: `ua-parser-js` 用于解析用户代理。

### 快速开始

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-username/LyraNet.git
    cd LyraNet
    ```

2.  **安装依赖**:
    ```bash
    npm install
    # 或
    yarn install
    ```

3.  **运行开发服务器**:
    ```bash
    npm run dev
    # 或
    yarn dev
    ```

4.  **打开浏览器**:
    访问 [http://localhost:3000](http://localhost:3000) 查看运行中的应用。
