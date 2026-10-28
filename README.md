# 🎨 Yanhao's Marketing Portfolio

> 一个**动态、深色、玻璃拟态风格**的个人作品集站点 —— 用纯前端（HTML/CSS/JS）打造，无需任何框架，可直接部署到 GitHub Pages。
>
> 不再用 Canva 模板，而是有自己的视觉语言与交互细节。

---

## ✨ 这个站点的特点

| 特性 | 说明 |
|------|------|
| 🌑 **深色玻璃拟态** | 暗色背景 + 半透明磨砂面板 + 渐变强调色（紫/青/粉） |
| 🎬 **动态背景** | Canvas 粒子连线，鼠标靠近会互动、粒子变亮 |
| 🪐 **Hero 轨道动画** | 中央渐变球体 + 三层旋转轨道 + 浮动能力标签 |
| 📖 **可展开 Case 卡片** | 点击展开/收起项目详情，符合 HR 快速浏览习惯 |
| 📊 **技能条动画** | 滚动到视口时进度条自动填充 |
| 🎭 **时间线** | 教育 / 实习 / 舞台经历按时间轴呈现 |
| 🌊 **滚动入场动效** | 所有模块滚动到视口时淡入上浮 |
| 📱 **完全响应式** | 桌面 / 平板 / 手机自适应 |

---

## 🗂 文件结构

```
.
├── index.html      # 页面结构（导航 / Hero / About / Cases / Skills / Journey / Contact）
├── styles.css      # 全部样式（设计语言、动画、响应式）
├── data.js         # 内容数据（Cases & 时间线，改这里就能更新内容）
├── app.js          # 交互逻辑（渲染、动效、Canvas、展开收起）
└── README.md       # 本文件
```

---

## 🚀 如何预览 / 部署

### 方式一：本地预览（30 秒）

直接双击 `index.html` 用浏览器打开即可。

或者用命令行（推荐，能避免某些浏览器对本地文件跨域的限制）：

```bash
# 在仓库根目录执行
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

### 方式二：部署到 GitHub Pages（免费、永久在线）

1. 在 GitHub 新建一个仓库，命名为 `你的用户名.github.io`（这是**用户站点**，可以直接作为你的主页），或者命名为 `marketing-portfolio`（项目站点）。
2. 把这四个文件（`index.html` / `styles.css` / `data.js` / `app.js`）上传到仓库。
3. 进入仓库 **Settings → Pages**，Source 选择 `main` 分支、`/ (root)`，保存。
4. 等待 1 分钟左右，访问：
   - 用户站点：`https://你的用户名.github.io`
   - 项目站点：`https://你的用户名.github.io/marketing-portfolio`

5. 把这个链接放进简历的「作品集」一栏，直接可点。

> 💡 **建议**：把仓库命名为 `你的用户名.github.io`，这样它就是你整个 GitHub 的主页，最简洁。

---

## ✏️ 如何定制内容

你只需要修改 **`data.js`** 这一个文件：

- **Cases（案例）**：改 `cases` 数组。每个案例有 `title` / `company` / `role` / `date` / `blocks`（背景/洞察/执行/反思）/ `results`（关键成果）。想加第四个案例，直接复制一个对象进去即可。
- **时间线**：改 `journey` 数组。每项有 `date` / `tag` / `title` / `text`。

想改**个人介绍、联系方式、技能百分比、标签云**，编辑 `index.html` 里对应的部分即可（都有清晰注释）。

想改**配色**，编辑 `styles.css` 最顶部的 `:root` 变量：

```css
--accent:  #8b5cf6;  /* 主紫 */
--accent-2:#22d3ee;  /* 青 */
--accent-3:#f472b6;  /* 粉 */
```

---

## 📬 联系方式占位

`index.html` 里的 LinkedIn 一项目前是 `add-your-link`，记得替换成你的真实链接。

---

© Cheng Yanhao · Built with vanilla HTML / CSS / JS · Hosted on GitHub Pages
