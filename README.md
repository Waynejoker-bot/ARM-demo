# AI Revenue Management OS

以 Agent-first 为核心理念的销售智能工作台。不是 CRM 看板加聊天框，而是围绕 4 个专业 Agent 协作的对话式操作系统。

## 产品理念

每个销售员配一个 Business Partner Agent（BPAgent），每个客户有一个客户 Agent，每个商机有一个商机 Agent。销售只需要做一个动作——把会议链接发给 BPAgent，后续 3 个 Agent 自动协作完成理解、分析、推荐和风险预警。

## Agent 架构

```
┌─ BPAgent（Business Partner Agent）
│   ├─ 一线销售 BPAgent ×N（1 销售 = 1 实例）
│   └─ 主管 BPAgent ×1
│
└─ 客户 Agent（1 客户 = 1 实例）
    └─ 商机 Agent ⊂ 客户 Agent（1 商机 = 1 实例）
```

- **BPAgent 面向人**：对话 + 卡片流转，是销售和主管的业务伙伴
- **客户/商机 Agent 面向对象**：不直接面向人，为 BPAgent 提供事实和判断

## 核心流程：会后闭环

```
销售参加完会议
→ 发送会议链接给 BPAgent
→ BPAgent 生成会议摘要卡片
→ 销售追问 / confirm
→ apply 到客户 Agent（更新 Account Thread）
→ 商机 Agent 自动响应（阶段推进 / 风险预警 / 下一步建议）
→ 销售 confirm 下一步 → apply
→ 风险升高自动通知主管 BPAgent
```

## 页面结构

| 路由 | 定位 |
|------|------|
| `/` | 主入口 · Conversational Agent OS |
| `/pipeline` | Pipeline 看板（辅助视图） |
| `/settings` | 设置 |
| `/meetings/:id` | 会议工作台（下钻） |
| `/deals/:id` | 商机详情（下钻） |
| `/customers/:id` | 客户详情（下钻） |

## 4 个 Agent 的能力

### 一线销售 BPAgent
- 素材理解与结构化（会议链接 → 摘要卡片）
- 日常任务推送（每日 Top 3 + 会议准备）
- 执行闭环（confirm → apply → sync CRM）
- 向上求助（自动打包上下文上报主管）

### 主管 BPAgent
- 团队状态监控（团队日报 + 异常预警）
- 辅导与培训（基于会议数据的辅导建议）
- 审批与资源调配（折扣审批 → 结果回传）

### 客户 Agent
- 客户健康度评估（关系趋势 + 关键联系人）
- Account Thread 管理（完整交互时间线）
- 跨商机协调

### 商机 Agent（⊂ 客户 Agent）
- 商机阶段推进（条件评估 + 推进建议）
- 风险识别与预警（多因子风险评分 + 自动升级主管）
- 预测与下一步建议

## 设计原则

- `suggestion → confirm → apply → sync` 必须分离
- 每张卡片标注来源 Agent（销售 BPAgent / 客户 Agent / 商机 Agent / 主管 BPAgent）
- Explainability：置信度、数据新鲜度、证据入口
- 会议是核心事实源

## 技术栈

- Next.js 15 App Router
- TypeScript
- Vitest + Testing Library
- SQLite（对话持久化）
- GLM 模型代理（服务端 route handler）

## 本地运行

```bash
npm install
```

配置环境变量（`.env.local`）：

```bash
GLM_API_KEY=your_glm_api_key_here
```

启动：

```bash
npm run dev
```

访问 `http://localhost:3000`

## 常用命令

```bash
npm run dev       # 开发
npm run build     # 构建
npm run test      # 测试（43 文件 / 141 用例）
```

## 项目结构

```
app/                          Next.js 路由与页面
app/api/conversational-os/    对话 API（消息、线程、重置）
app/api/agent/chat/           Agent 对话代理
app/api/intake/classify/      素材分类 API
src/components/               共享组件、智能卡片、对话界面
src/lib/conversational-os/    对话运行时、种子数据、持久化、模型调用
src/lib/domain/               统一领域类型与枚举
src/lib/mocks/                mock 数据层（含真实会议案例）
src/lib/model/                模型调用封装与 prompt
src/lib/semantics/            suggestion / confirm / apply / sync 语义
tests/unit/                   单元测试
docs/current/                 当前 canonical 文档
docs/diagrams/                架构图与流程图
docs/plans/                   设计与实施计划
```

## 数据与模型边界

- 业务数据全部 mock，不依赖真实 CRM/会议/邮件后端
- 模型只用于 Agent 对话回复和卡片生成
- API Key 从环境变量读取，不写入客户端
- 当前不含真实数据库、CRM 写回、身份认证
