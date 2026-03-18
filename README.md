# AI Revenue Management OS Frontend

一个以 `Agent-first` 为核心交互方式的销售智能前端演示项目。

本项目不是传统 CRM 看板，也不是给 BI 图表外面套一个聊天框，而是围绕“可解释、可对话、可纠错、可确认”的销售 Agent 工作台来构建。当前阶段以前端完整页面体系为目标，所有业务数据均来自 mock，只有 Agent 对话走真实模型代理。

## 项目定位

- 面向 CEO、销售主管、一线销售三类角色
- 用统一对象模型承载客户、联系人、会议、商机、预测、辅导等核心对象
- 让 Agent 先给出结论、理由和下一步建议，再配合列表、卡片、图表完成判断和操作
- 明确区分 `suggestion`、`confirm`、`apply`、`sync`，避免把 AI 建议误当成系统已更新

## 当前已实现范围

- 全局 App Shell：左侧主导航、顶部上下文栏、右侧全局 Agent 面板
- 全量前端页面：首页、角色工作台、收入中心、Pipeline、Deals、Customers、Meetings、Sales Team、Recaps、Agent Workspace、Data Sources、Settings
- 统一 mock 数据层：覆盖正常、风险升高、低置信度、数据缺失、数据过期、同步失败等场景
- Explainability 机制：AI 结论、置信度、数据新鲜度、关键依据、证据入口、反馈与重跑
- Agent 对话代理：前端不暴露密钥，服务端 route handler 代理模型调用

## 页面结构

- `/home`
- `/ceo-command-center`
- `/sales-manager-cockpit`
- `/sales-war-room`
- `/agent`
- `/agent-workflows`
- `/revenue`
- `/pipeline`
- `/deals`
- `/deals/[dealId]`
- `/customers`
- `/customers/[customerId]`
- `/meetings`
- `/meetings/[meetingId]`
- `/sales-team`
- `/sales-team/[repId]`
- `/recaps`
- `/recaps/[recapId]`
- `/data-sources`
- `/settings`

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query
- Vitest + Testing Library
- Playwright
- dnd-kit

## 本地运行

先安装依赖：

```bash
npm install
```

然后配置环境变量。在项目根目录创建 `.env.local`：

```bash
GLM_API_KEY=your_glm_api_key_here
```

启动开发环境：

```bash
npm run dev
```

默认开发地址：

```text
http://localhost:3000
```

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run test
npm run test:e2e
```

## 项目结构

```text
app/                  Next.js 路由与页面
app/api/agent/chat/   Agent 对话代理接口
src/components/       共享组件、智能卡片、Agent 面板、工作台组件
src/lib/domain/       统一领域类型与枚举
src/lib/mocks/        mock 数据层
src/lib/model/        模型调用封装与 prompt
src/lib/semantics/    suggestion / confirm / apply / sync 等语义逻辑
src/state/            前端状态管理
tests/unit/           单元测试
playwright/           E2E 与 smoke 测试
docs/plans/           设计与实现计划文档
docs/status/          阶段进度记录
```

## 数据与模型边界

- 业务数据全部来自 mock，不依赖真实 CRM、邮件、会议、聊天后端
- 模型能力只用于 Agent 对话与上下文回答
- API Key 从环境变量读取，不写入客户端代码
- 当前不包含真实数据库、真实 CRM 写回、真实身份认证

## 适合用来演示的能力闭环

- 会议完成后查看 Agent 总结
- 下钻证据和关键依据
- 修正重点结论
- 生成 Next Step 建议
- 确认后应用到 Deal
- 决定是否同步到外部 CRM

## 说明

这是一个前端完整度优先的演示工程，不是业务后端工程。如果你要把它接入真实数据源，建议保持当前的统一对象模型和 mock-to-adapter 替换路径，不要直接把页面耦合到某个 CRM 或会议系统的数据结构。
