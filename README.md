# Local Script Gen · 本地生活短视频脚本生成器

为本地商家生成短视频脚本，支持三种格式：
- **② 云剪型** — 素材包 → 批量分发
- **④ 痛点问答型** — 搜索流量 → 决策转化  
- **⑤ 幕后制作型** — 过程即内容 → 品牌信任

## 本地运行

**前提：** Node.js

1. 安装依赖：
   ```
   npm install
   ```

2. 获取硅基流动 API Key：
   - 注册：https://cloud.siliconflow.cn
   - 新用户有免费额度，无需信用卡

3. 在项目根目录创建 `.env.local`：
   ```
   SILICONFLOW_API_KEY=sk-xxxxxxxxxx
   ```

4. 启动：
   ```
   npm run dev
   ```
