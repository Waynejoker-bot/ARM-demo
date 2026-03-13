> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Role Workspaces Implementation Plan

日期：2026-03-08

状态：待执行

关联设计：
- `docs/plans/2026-03-08-role-workspaces-design.md`

范围确认：

- 不修改现有 `/home`
- 新增三个一级页面
- 在左侧导航中注册三个新入口
- 复用现有 mock 数据，不引入新后端
- 页面以 Agent 决策卡片为主，不做 CRM 列表页形态
- 全局 Agent 面板升级为可输入、可收起、可拖入上下文的对话工作区

目标页面：

1. `/ceo-command-center`
2. `/sales-manager-cockpit`
3. `/sales-war-room`

---

## 1. 实施策略

按以下顺序执行：

1. 先写失败测试
2. 再实现共享导航与工作台配置
3. 再实现共享决策卡片组件
4. 再落三个新页面
5. 最后运行测试与构建验证

---

## 2. 文件变更计划

### 2.1 测试

新增：

- `tests/unit/navigation/navigation-config.test.ts`
- `tests/unit/workspaces/role-workspaces.test.ts`
- `tests/unit/agent/agent-panel.test.tsx`
- `tests/unit/model/prompts.test.ts`

测试目标：

- 导航配置包含三个新一级页面
- 三个工作台配置完整
- 每个工作台都至少有 Agent 主叙事、决策卡片、系统动作、信任状态
- Agent 面板支持收起与展开
- Agent 面板发送用户输入，而不是只能发送默认 prompt
- 拖入决策卡后，模型请求会附带卡片上下文
- prompt builder 会拼接当前页 context、拖入卡片和对话历史

### 2.2 共享配置

新增：

- `src/lib/navigation.ts`
- `src/lib/role-workspaces.ts`

职责：

- `navigation.ts` 统一维护左侧导航顺序和标签
- `role-workspaces.ts` 统一维护三个工作台的文案、卡片、状态和区块数据

### 2.3 共享组件

新增：

- `src/components/workspaces/decision-cards.tsx`
- `src/components/agent/agent-panel.tsx`

职责：

- 渲染 `DecisionCard`
- 渲染 `InterventionCard`
- 渲染 `ActionPlanCard`
- 渲染 `TrustCard`
- 渲染可输入、可附加上下文的 Agent 对话面板

约束：

- 优先复用现有 `Badge`、`SectionCard`、`PageHeader`
- 新组件负责建立更强的“决策台”视觉语义

### 2.4 页面

新增：

- `app/ceo-command-center/page.tsx`
- `app/sales-manager-cockpit/page.tsx`
- `app/sales-war-room/page.tsx`

页面要求：

- 每页顶部必须有 Agent 主叙事区
- 每页主体必须先展示高优先级决策卡
- 每页都要显示系统已在推进中的动作
- 每页都要显示信任/数据完整性提醒
- 所有对象下钻暂时使用现有页面链接

### 2.5 导航接入

修改：

- `src/components/shared/ui.tsx`
- `src/state/agent-panel-store.ts`
- `src/lib/model/types.ts`
- `src/lib/model/prompts.ts`
- `app/api/agent/chat/route.ts`

目标：

- 左侧导航改为消费 `src/lib/navigation.ts`
- 注册三个新页面入口
- 保持现有其它导航项继续可用
- Agent 面板从按钮触发改为输入式交互
- Agent 面板支持展开 / 收起
- Agent 面板接收拖拽卡片上下文

---

## 3. TDD 执行步骤

### Step 1

新增 `tests/unit/navigation/navigation-config.test.ts`

断言：

- 导航项包含 `/ceo-command-center`
- 导航项包含 `/sales-manager-cockpit`
- 导航项包含 `/sales-war-room`
- 标签分别为 `CEO 主控室`、`销售主管驾驶舱`、`一线销售作战室`

运行：

- `npm run test -- tests/unit/navigation/navigation-config.test.ts`

预期：

- 失败，原因是导航配置模块尚不存在

### Step 2

新增 `tests/unit/workspaces/role-workspaces.test.ts`

断言：

- 存在三个工作台定义
- 每个工作台有标题、说明、主叙事
- 每个工作台都有高优先级决策卡
- 每个工作台都有系统动作区和信任区

运行：

- `npm run test -- tests/unit/workspaces/role-workspaces.test.ts`

预期：

- 失败，原因是工作台配置模块尚不存在

### Step 3

实现：

- `src/lib/navigation.ts`
- `src/lib/role-workspaces.ts`

运行：

- `npm run test -- tests/unit/navigation/navigation-config.test.ts tests/unit/workspaces/role-workspaces.test.ts`

预期：

- 通过

### Step 4

实现：

- `src/components/workspaces/decision-cards.tsx`
- 三个页面文件

要求：

- 组件只消费共享配置，不在页面里散落硬编码结构
- 现有页面不改职责

### Step 5

修改：

- `src/components/shared/ui.tsx`

目标：

- 左侧导航改为共享配置
- 三个入口出现在导航中

### Step 6

新增 Agent 相关测试：

- `tests/unit/agent/agent-panel.test.tsx`
- `tests/unit/model/prompts.test.ts`

断言：

- 面板按钮语义是“收起 / 展开”
- 用户输入优先于默认 prompt
- 决策卡拖入后会显示附件 chip
- 发给模型的请求包含页面 context、用户问题、附件内容

### Step 7

验证：

- `npm run test`
- `npm run build`

如环境允许，再尝试：

- `npm run test:e2e`

若失败，要明确说明环境原因，不虚报通过。

---

## 4. 页面内容结构计划

### 4.1 CEO 主控室

区块顺序：

1. `CEO Agent Brief`
2. `Top Decisions`
3. `Revenue Exposure`
4. `Strategic Bets`
5. `Interventions In Flight`
6. `Trust And Data Integrity`

### 4.2 销售主管驾驶舱

区块顺序：

1. `Manager Agent Brief`
2. `Intervention Queue`
3. `Pipeline Reality Gap`
4. `Rep Coaching Queue`
5. `Team Commitments`
6. `Data And Sync Exceptions`

### 4.3 一线销售作战室

区块顺序：

1. `Rep Agent Brief`
2. `Today Focus Stack`
3. `Customer Commitment Tracker`
4. `Prepared By Agent`
5. `Deal Risks To Resolve`
6. `Missing Context`

---

## 5. 实现边界

本轮不做：

- 重构旧 `/home`
- 重构 `Deal / Meeting / Pipeline / Revenue` 页面结构
- 新增真实后端
- 新增持久化状态
- 新增复杂筛选和个性化偏好

---

## 6. 完成标准

只有满足以下条件，才能说这轮实现完成：

1. 三个新页面存在并可访问
2. 左侧导航出现三个新入口
3. 三个页面都以 Agent 决策卡片为主，不是 CRM 表格
4. 三个页面都能下钻到现有对象页
5. 相关新增测试先失败后转绿
6. `npm run test` 通过
7. `npm run build` 通过
