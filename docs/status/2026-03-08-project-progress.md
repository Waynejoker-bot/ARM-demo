# ARM-demo 项目进度文档

更新时间：2026-03-08

---

## 1. 当前结论

项目当前处于：

`前端全量页面 + mock 数据驱动 + Agent 对话接入 + 核心交互链路验证完成`

按照 `docs/plans/2026-03-08-ai-sales-os-frontend-full-mock-build-plan.md` 的当前范围来判断，现阶段可以视为：

- 主要开发目标已完成
- 关键验收项已覆盖
- 项目已具备继续演示、继续迭代、继续迁移目录的稳定基础

---

## 2. 已完成范围总览

### 2.1 工程基础

已完成：

- Next.js App Router 项目初始化
- TypeScript、Vitest、Playwright、Tailwind、Zustand、React Query 依赖接入
- 全局 `AppShell`、左侧导航、顶部信息区、右侧 Agent 面板
- 全局 `loading` / `error` / `not-found` 页面

当前可用命令：

```bash
npm run dev
npm run build
npm run test
npm run test:e2e
```

---

## 3. 产品范围完成情况

### 3.1 页面完成情况

项目计划中的前端页面已落地，包含：

- `/home`
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

说明：

- 所有页面均使用 mock 数据驱动
- 当前没有业务后端依赖
- 用户界面文案已切换为中文

### 3.2 角色化首页

首页已不再是“统一首页加角色摘要”，而是支持真正拆开的角色视图：

- `CEO 首页`
- `销售主管首页`
- `一线销售首页`

三者已分别体现不同关注点：

- CEO：收入、战略商机、组织风险、经营摘要
- 销售主管：团队风险、重点商机、辅导建议、阶段趋势
- 一线销售：今日待办、下一步动作、个人 pipeline、风险客户

---

## 4. 数据与对象模型

### 4.1 统一领域模型

已建立统一对象模型，核心对象包含：

- `Account`
- `Contact`
- `Deal`
- `Meeting`
- `Conversation`
- `EvidenceRef`
- `AgentOutput`
- `ForecastSnapshot`
- `RepScorecard`
- `RecapRecord`
- `WorkflowEvent`
- `DataSourceRecord`
- `SyncRecord`
- `AlertRecord`

### 4.2 Mock 数据层

已完成完整 mock 数据图谱，支持以下场景：

- 正常推进
- 高风险商机
- 低置信度结论
- 数据过期
- 数据缺失
- 转录缺失
- CRM 同步失败
- 角色化视图
- 收入预测
- 团队辅导

结论：

- 当前前端展示不依赖真实数据库
- 当前业务对象关系已足够支撑所有页面联动演示

---

## 5. Agent-first 能力完成情况

### 5.1 全局 Agent 能力

已完成：

- 全局 Agent 面板
- 页面上下文注入
- 中文对话提示
- 模型请求中的处理中状态
- 失败场景下的错误反馈

### 5.2 可解释性与信任机制

已完成共享智能组件，包括：

- `KpiCard`
- `AgentBriefCard`
- `ExplainableCard`
- `HealthScoreRing`
- `RiskTag`
- `StageTag`
- `ConfidenceBadge`
- `DataFreshnessBadge`
- `EvidenceDrawer`
- `SuggestionActionCard`
- `ForecastCard`
- `RepScoreCard`
- `WorkflowEventCard`

当前已实现的关键体验：

- 重要 AI 结论可查看证据
- 数据新鲜度会影响信任展示
- 缺失数据会明确暴露，不会被隐藏
- 风险和解释可以从摘要下钻到对象详情

### 5.3 Agent 操作语义

当前已实现并可演示：

- `suggestion`
- `confirm`
- `apply`
- `sync`

说明：

- `confirm`、`apply`、`sync` 已明确分离
- 不会把 Agent 建议自动同步到 CRM
- 管道页已实现 `proposal-first`，即先提议，再确认应用

---

## 6. 页面深度补充情况

已补足此前 review 中提到的“placeholder 完成但不够深”的问题。

当前重点页面状态如下：

- `Deal Detail`：已支持解释卡、证据查看、建议编辑、确认、应用
- `Meeting Detail`：已支持总结查看、证据查看、编辑、确认闭环
- `Pipeline`：已支持阶段提议、确认应用、同步仍分离
- `Revenue`：已支持收入摘要、风险驱动、下钻商机、向 Agent 追问
- `Data Sources`：已显示断连影响，并能跳转到受影响对象
- `Settings`：已从纯占位说明升级为结构化配置展示页

同时已补上基础状态页：

- 加载态
- 错误态
- 未找到态

---

## 7. 模型接入状态

### 7.1 已完成

模型调用已拆分为清晰结构：

- `src/lib/model/provider.ts`
- `src/lib/model/glm-client.ts`
- `src/lib/model/prompts.ts`
- `src/lib/model/types.ts`
- `app/api/agent/chat/route.ts`

当前实现原则：

- API Key 从环境变量读取
- 前端不直接暴露 Key
- 使用 Next.js route handler 代理模型请求
- 业务数据仍全部来自 mock 层

### 7.2 当前边界

当前模型接入只用于：

- Agent 对话
- 页面上下文感知回复

未做内容：

- 真实业务写库
- 真实 CRM API 写回
- 真实邮件/会议/录音系统集成
- 用户身份认证

这些未完成项是当前阶段的范围边界，不是缺陷。

---

## 8. 测试与验证状态

### 8.1 单元测试

已通过：

- Agent action semantics 测试
- Pipeline proposal semantics 测试
- Mock dataset 覆盖测试

### 8.2 端到端测试

已通过的浏览器链路：

1. 销售主管首页 -> 风险商机 -> 证据 -> 下一步建议 -> 应用
2. Pipeline 提议 -> 待确认 -> 确认应用 -> 保持未同步
3. 会议详情 -> 查看证据 -> 编辑总结 -> 确认
4. 收入页 -> 下钻风险驱动 -> 打开商机 -> 询问 Agent
5. 数据源页 -> 断连来源 -> 受影响对象显示可信度降级
6. CEO / 销售主管 / 一线销售首页视图区分验证

### 8.3 已执行的验证命令

本轮已确认通过：

```bash
npm run test
npm run build
npm run test:e2e
```

---

## 9. 当前项目状态判断

如果以当前计划文档为准，项目状态可以定义为：

`已完成本轮计划目标`

如果以“是否可继续商用级开发”为准，项目状态可以定义为：

`已完成完整前端演示版 / 交互验证版，尚未进入真实生产集成阶段`

---

## 10. 当前已知边界与后续方向

### 10.1 当前已知边界

当前系统仍然是：

- mock 驱动
- 前端为主
- 无真实业务持久化
- 无真实账号权限体系
- 无真实第三方业务系统写回

### 10.2 下一阶段可以做什么

如果继续推进，建议优先级如下：

1. 把角色首页从 query 参数形式进一步拆成独立路由
2. 将当前页面级交互状态升级为更完整的 client-side mock store
3. 让“应用后的状态”在更多页面之间联动刷新
4. 为更多分析页补充更深的过滤、排序、切换交互
5. 在明确范围后，再讨论真实后端或真实业务集成

---

## 11. 一句话总结

当前项目已经从“规划与搭建阶段”进入“完整前端演示可运行阶段”，并且核心 Agent-first 语义、角色化首页、页面体系、mock 数据、模型对话和验证链路都已经落地。
