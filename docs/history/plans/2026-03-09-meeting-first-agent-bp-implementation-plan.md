> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Meeting-First Agent BP 实现规划文档

## 1. 文档定位

这是一份执行前的实现规划文档。

它不开始写代码，只定义：

- 先做什么
- 后做什么
- 每一步改哪些文件
- 每一步先写什么测试
- 每一步如何验证

本计划默认遵守项目里的强约束：

1. 先设计，后规划，再执行
2. 先写失败测试，再写实现
3. 所有业务数据先用 mock
4. 所有关键状态必须保留 `suggestion / confirm / apply / sync`
5. 不建立真实业务后端
6. Agent 对话仍通过现有模型代理层完成

---

## 2. 本轮规划目标

本轮规划的目标不是“改完整个产品”，而是把当前仓库从现有的多角色演示骨架，推进到 Meeting-first Agent BP 结构。

重点落在 4 个核心页面和 1 个主管汇报层：

1. `Today Cockpit`
2. `Meeting Workbench`
3. `Account Thread Detail`
4. `Sales Manager Cockpit + Team Brief`
5. `Rep Report View`

---

## 3. 实施原则

## 3.1 优先顺序

按以下顺序执行：

1. 先补共享对象模型
2. 再补 mock 数据图
3. 再补 selectors 和派生聚合
4. 再补共享组件
5. 再改核心页面
6. 最后补页面间联动和验证

## 3.2 不应先做的事

- 不先改视觉细节
- 不先改 CEO / Revenue 页面
- 不先做真实同步
- 不先做复杂权限
- 不先做全站重构

## 3.3 保守迁移策略

尽量采用“重定义现有页面 + 新增少量必要视图”的策略：

- 重定义 `/home?role=rep`
- 重定义 `/meetings/[meetingId]`
- 重定义 `/customers` 与 `/customers/[customerId]`
- 重定义 `/sales-manager-cockpit`
- 新增或补齐 `Rep Report View`

---

## 4. 目标文件范围

## 4.1 重点会修改的已有文件

- `app/home/page.tsx`
- `app/meetings/[meetingId]/page.tsx`
- `app/customers/page.tsx`
- `app/customers/[customerId]/page.tsx`
- `app/sales-manager-cockpit/page.tsx`
- `app/sales-team/[repId]/page.tsx`
- `src/lib/domain/types.ts`
- `src/lib/domain/enums.ts`
- `src/lib/mocks/index.ts`
- `src/lib/mock-selectors.ts`
- `src/components/shared/ui.tsx`
- `src/components/intelligence/cards.tsx`
- `src/state/agent-panel-store.ts`

## 4.2 计划新增的文件

- `src/components/meeting/workbench.tsx`
- `src/components/threads/account-thread-panels.tsx`
- `src/components/reports/report-cards.tsx`
- `src/lib/derived/report-snapshots.ts`
- `src/lib/derived/account-threads.ts`
- `tests/unit/domain/account-thread-derivations.test.ts`
- `tests/unit/domain/report-snapshots.test.ts`
- `tests/unit/pages/today-cockpit-page.test.tsx`
- `tests/unit/pages/meeting-workbench-page.test.tsx`
- `tests/unit/pages/account-thread-page.test.tsx`
- `tests/unit/pages/sales-manager-cockpit-page.test.tsx`

文件名可以在执行前微调，但语义模块应保持这组划分。

---

## 5. 里程碑规划

## Milestone 1：扩共享对象模型

### 目标

让领域模型能够表达：

- Meeting-first
- Account Thread
- Rep Report Snapshot
- 两层状态模型

### 先写测试

新增：

- `tests/unit/domain/account-thread-derivations.test.ts`
- `tests/unit/domain/report-snapshots.test.ts`

先验证这些行为：

1. 多个 Meeting 可以聚合为一条 Account Thread
2. Account Thread 可以同时输出“客户进展”和“当前动作”
3. 多条 Account Thread 可以派生出 Rep Report Snapshot
4. Rep Report Snapshot 能统计：触达客户数、Meeting 数、新形成商机数、停滞数、需主管介入数

### 再改文件

- `src/lib/domain/types.ts`
- `src/lib/domain/enums.ts`

### 需要引入的核心类型

- `AccountThread`
- `RepReportSnapshot`
- `CustomerProgressStage`
- `ExecutionState`
- `InterventionNeed`

### 验证命令

```bash
npm run test -- tests/unit/domain/account-thread-derivations.test.ts
npm run test -- tests/unit/domain/report-snapshots.test.ts
```

---

## Milestone 2：扩 mock 数据图

### 目标

让 mock 数据先支撑新语义，再改页面。

### 先写测试

补或新增：

- `tests/unit/mocks/mock-dataset.test.ts`
- `tests/unit/domain/account-thread-derivations.test.ts`

先验证这些场景存在：

1. 线索期线程
2. 已建联线程
3. 已形成商机但未稳定推进的线程
4. 商务推进中线程
5. 会后待确认线程
6. 停滞线程
7. 需要主管介入线程
8. 能汇总成主管简报的多销售数据

### 再改文件

- `src/lib/mocks/index.ts`
- `src/lib/mock-selectors.ts`
- 新增 `src/lib/derived/account-threads.ts`
- 新增 `src/lib/derived/report-snapshots.ts`

### 输出要求

mock 必须能直接喂给这几个页面：

- Today Cockpit
- Meeting Workbench
- Account Thread Detail
- Sales Manager Cockpit
- Rep Report View

### 验证命令

```bash
npm run test -- tests/unit/mocks/mock-dataset.test.ts
npm run test -- tests/unit/domain/account-thread-derivations.test.ts
npm run test -- tests/unit/domain/report-snapshots.test.ts
```

---

## Milestone 3：补共享 UI 语义组件

### 目标

把新页面依赖的共享组件先建立好，避免页面里堆匿名结构。

### 先写测试

新增页面级渲染测试前，先补最小组件渲染测试：

- `tests/unit/pages/today-cockpit-page.test.tsx`
- `tests/unit/pages/meeting-workbench-page.test.tsx`

在这一步先只验证关键文案和区块存在，不验证完整视觉。

### 再改文件

- 新增 `src/components/meeting/workbench.tsx`
- 新增 `src/components/threads/account-thread-panels.tsx`
- 新增 `src/components/reports/report-cards.tsx`
- 视情况扩充 `src/components/intelligence/cards.tsx`
- 视情况扩充 `src/components/shared/ui.tsx`

### 最少需要的组件

- `AgentBriefHero`
- `MeetingQueueCard`
- `PendingConfirmCard`
- `AccountThreadCard`
- `ThreadTimelinePanel`
- `MeetingEvidencePanel`
- `MeetingDecisionPanel`
- `ReportDraftCard`
- `TeamBriefCard`
- `InterventionQueueCard`
- `RepSnapshotCard`
- `RepReportSummaryPanel`

### 验证命令

```bash
npm run test -- tests/unit/pages/today-cockpit-page.test.tsx
npm run test -- tests/unit/pages/meeting-workbench-page.test.tsx
```

---

## Milestone 4：重构 Today Cockpit

### 目标

把当前一线销售首页从概览页改成真正的 Today 决策舱。

### 先写失败测试

新增：

- `tests/unit/pages/today-cockpit-page.test.tsx`

测试覆盖：

1. 页面首先渲染 Agent 今日简报
2. 页面有“今日会议流”区块
3. 页面有“待确认区”区块
4. 页面有“客户推进线程列表”区块
5. 页面有“对主管汇报草稿”区块
6. 页面能从线程或会议跳转到对应详情页

### 再改文件

- `app/home/page.tsx`
- 如有必要新增 `src/features/home/rep-today-cockpit.tsx`

### 验证命令

```bash
npm run test -- tests/unit/pages/today-cockpit-page.test.tsx
```

---

## Milestone 5：重构 Meeting Workbench

### 目标

把现有 Meeting 详情页重构成主生产页面。

### 先写失败测试

新增：

- `tests/unit/pages/meeting-workbench-page.test.tsx`

测试覆盖：

1. 页面包含会前准备、会议证据、Agent 判断、会后提议四大区域
2. 页面显式区分：Account Thread / Deal / CRM 的影响范围
3. 页面保留修改、驳回、重跑、确认动作
4. 页面在 transcript 缺失时显示降级与低可信度提示

### 再改文件

- `app/meetings/[meetingId]/page.tsx`
- `src/components/meeting/workbench.tsx`
- `src/lib/mock-selectors.ts`

### 验证命令

```bash
npm run test -- tests/unit/pages/meeting-workbench-page.test.tsx
```

---

## Milestone 6：重构 Customers 为 Account Thread 视图

### 目标

把当前客户页从“客户对象页”改成“客户推进线程页”。

### 先写失败测试

新增：

- `tests/unit/pages/account-thread-page.test.tsx`

测试覆盖：

1. 列表页展示的是线程，而不是静态客户资料列表
2. 详情页展示两层状态：客户进展 / 当前动作
3. 详情页展示最近变化与推进时间线
4. 详情页展示 Deal 投影区
5. 详情页可跳转到关键 Meeting 和 Deal

### 再改文件

- `app/customers/page.tsx`
- `app/customers/[customerId]/page.tsx`
- `src/components/threads/account-thread-panels.tsx`
- `src/lib/derived/account-threads.ts`

### 验证命令

```bash
npm run test -- tests/unit/pages/account-thread-page.test.tsx
```

---

## Milestone 7：重构 Sales Manager Cockpit + Team Brief

### 目标

把主管首页升级成真正的汇报层和介入层页面。

### 先写失败测试

新增：

- `tests/unit/pages/sales-manager-cockpit-page.test.tsx`

测试覆盖：

1. 页面第一屏出现 Agent 主管简报
2. 页面包含 Team Brief Overview
3. 页面包含 Intervention Queue
4. 页面包含 Rep Weekly Snapshot 列表
5. 页面能跳转到 Rep Report View、Account Thread、Deal、Pipeline

### 再改文件

- `app/sales-manager-cockpit/page.tsx`
- `app/sales-team/[repId]/page.tsx`
- `src/components/reports/report-cards.tsx`
- `src/lib/derived/report-snapshots.ts`

### 验证命令

```bash
npm run test -- tests/unit/pages/sales-manager-cockpit-page.test.tsx
```

---

## Milestone 8：补全 Rep Report View

### 目标

让主管能查看单个销售的结构化汇报视图。

### 先写失败测试

新增或扩充：

- `tests/unit/pages/sales-manager-cockpit-page.test.tsx`
- `tests/unit/workspaces/role-workspace-page.test.tsx`

测试覆盖：

1. `sales-team/[repId]` 页面显示本周结构化摘要
2. 页面显示重点对象列表，而不是流水账
3. 页面能从客户对象下钻到线程和 Deal

### 再改文件

- `app/sales-team/[repId]/page.tsx`
- `src/components/reports/report-cards.tsx`

### 验证命令

```bash
npm run test -- tests/unit/pages/sales-manager-cockpit-page.test.tsx
```

---

## Milestone 9：更新 Agent 上下文语义

### 目标

让全局 Agent 面板理解新的页面语义和对象层级。

### 先写失败测试

新增或扩充：

- `tests/unit/navigation/navigation-config.test.ts`
- 新增 `tests/unit/agent-panel/agent-context.test.ts`

测试覆盖：

1. Today 页面默认上下文为今日工作优先级
2. Meeting 页面默认上下文为本次 Meeting 变化与确认
3. Account Thread 页面默认上下文为线程推进判断
4. Manager 页面默认上下文为团队汇总和介入建议

### 再改文件

- `src/state/agent-panel-store.ts`
- `src/components/shared/ui.tsx`
- 如需要：`src/lib/model/prompts.ts`

### 验证命令

```bash
npm run test -- tests/unit/agent-panel/agent-context.test.ts
```

---

## Milestone 10：端到端页面联动验证

### 目标

验证新的主线已经跑通。

### 需要补的流程测试

建议新增 Playwright journey：

- `playwright/journeys/rep-meeting-to-thread.spec.ts`
- `playwright/journeys/manager-team-brief-drilldown.spec.ts`

### 必测链路一：销售执行链路

```text
Today Cockpit
-> 打开某个 Meeting
-> 查看证据
-> 确认会后总结
-> 应用到 Account Thread
-> 看到汇报草稿生成
-> 选择是否同步 CRM
```

### 必测链路二：主管管理链路

```text
Sales Manager Cockpit
-> 查看 Team Brief
-> 打开某个销售的 Rep Report
-> 下钻到高风险客户线程
-> 查看关键 Meeting
-> 决定是否介入
```

### 验证命令

```bash
npm run test
npm run build
npm run test:e2e
```

---

## 6. 每个里程碑内的 TDD 执行模板

每个里程碑都按同一模板执行：

1. 写最小失败测试
2. 运行单测，确认失败原因正确
3. 写最小实现
4. 运行相关测试
5. 运行全量测试
6. 必要时运行构建
7. 再进入下一步

禁止：

- 先把页面改出来再补测试
- 一次同时重构多个页面又不分测试
- 不看输出就说完成

---

## 7. 详细执行顺序建议

建议最终执行顺序如下：

1. 补 domain types 与 enums
2. 补 account thread 派生逻辑
3. 补 report snapshot 派生逻辑
4. 扩 mock dataset
5. 扩 selectors
6. 建核心共享组件
7. 改 Today Cockpit
8. 改 Meeting Workbench
9. 改 Account Thread List / Detail
10. 改 Sales Manager Cockpit
11. 改 Rep Report View
12. 改 Agent 上下文
13. 跑端到端验证

这个顺序能最大限度减少返工。

---

## 8. 风险点与提前约束

## 8.1 风险一：把 Account Thread 做成客户详情页换皮

避免方式：

- 页面必须先讲推进，不先讲静态资料
- 时间线必须强调状态变化而不是活动日志

## 8.2 风险二：把 Team Brief 做成 KPI 面板

避免方式：

- 主管首页必须先有自然语言总结
- Intervention Queue 必须是一级模块

## 8.3 风险三：Meeting 页面被做回纪要页

避免方式：

- 页面必须有“状态提议”和“影响范围”区块
- 页面必须显式支持确认、驳回、重跑

## 8.4 风险四：Agent 仍然只是聊天框

避免方式：

- 每个核心页面主区都必须出现 Agent 判断卡
- 全局侧边面板只做补充，不做唯一入口

## 8.5 风险五：Deal 重新吞掉整个工作流

避免方式：

- 把 Deal 明确放在 Account Thread 后面
- 销售首页不以 Deal 列表作为第一优先级

---

## 9. 执行完成标准

只有满足以下条件，才算完成这一轮页面升级：

1. 四个核心页面都按新语义完成重构
2. 汇报层明确存在于销售端和主管端
3. 页面上已清晰区分“客户进展”和“当前动作”
4. Meeting 页面能完成“证据 -> 判断 -> 确认 -> 应用”的闭环
5. Manager 页面能完成“Team Brief -> Rep Report -> Thread/Deal 下钻”的闭环
6. 相关测试先红后绿
7. `npm run test` 通过
8. `npm run build` 通过

---

## 10. 当前阶段之后的自然下一步

这份计划得到确认后，再进入真正执行。

执行时建议只开一个主分支任务，按里程碑逐段推进，不要并发改四个页面。
