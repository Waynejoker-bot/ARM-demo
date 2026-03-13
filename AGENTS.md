# AGENTS.md

> 本文件为本项目中的所有 AI coding agents 提供最高优先级的项目级执行规范。
> 目标不是写出“能跑的界面”，而是按 `Agent-first` 产品思路构建一个可解释、可对话、可纠错、可确认的销售智能前端。

---

## 1. Source Of Truth

开始任何实现、重构、调试、补文档之前，先读取并遵守以下文件：

- `APIkey.md`
- `docs/current/README.md`
- `docs/current/product-direction.md`
- `docs/current/implementation-status.md`
- `docs/insights/anti-regression.md`
- `/Users/wayne/.codex/skills/frontend-design/SKILL.md`
- `.cursor/rules/tdd.mdc`
- `.cursor/rules/systematic-debugging.mdc`
- `.cursor/rules/superpowers-workflow.mdc`
- `.cursor/rules/verification-before-completion.mdc`

如果这些文档之间存在冲突，优先级如下：

1. 本文件 `AGENTS.md`
2. `.cursor/rules/*.mdc`
3. `docs/current/product-direction.md`
4. `docs/current/implementation-status.md`
5. `docs/insights/anti-regression.md`
6. `/Users/wayne/.codex/skills/frontend-design/SKILL.md`

---

## 2. Product Stance

本项目是 `Agent-first`，不是 `dashboard-first`。

这意味着：

- Dashboard、列表、图表是辅助理解界面，不是唯一主交互
- 任何核心页面都必须有 Agent 协作入口
- 任何关键 AI 结论都必须有证据路径
- 任何会影响业务状态的 AI 建议都必须可确认、可修改、可驳回、可重跑
- 不得把产品实现成“一个 BI 看板 + 一个后来补上的聊天框”

禁止事项：

- 不要把所有页面简化成聊天页面
- 不要自动应用 AI 输出
- 不要把数据缺失隐藏在漂亮的分数卡下面
- 不要为了视觉密度牺牲可解释性和操作语义

---

## 3. Required Workflow

任何功能开发都必须遵守 `.cursor/rules/superpowers-workflow.mdc` 中定义的顺序，并显式使用对应的 Codex skills：

1. `brainstorming`（设计）
2. `writing-plans`（规划）
3. `executing-plans`（执行）

强制要求：

- 未获设计批准，不写实现代码
- 未写计划文档，不进入执行
- 未确认偏差影响，不擅自改变范围

如果用户直接要求实现而设计仍不清晰：

- 先补设计或计划
- 明确假设和边界
- 得到用户确认后再动代码

---

## 4. TDD Is Mandatory

严格遵守 `.cursor/rules/tdd.mdc`，并在进入实现时使用 `test-driven-development` skill。

铁律：

```text
没有先写失败的测试，就不能写任何生产代码
```

适用范围：

- 新功能
- Bug 修复
- 重构
- 行为变更

执行要求：

1. 先写最小失败测试
2. 运行测试并确认失败原因正确
3. 写最小实现
4. 运行测试并确认通过
5. 再做重构

如果已经先写了实现：

- 删除
- 回到测试开始

---

## 5. Debugging Protocol

严格遵守 `.cursor/rules/systematic-debugging.mdc`，并在遇到异常、测试失败、构建失败或任何不符合预期的行为时使用 `systematic-debugging` skill。

铁律：

```text
未完成根本原因调查，不得提出任何修复方案
```

调试顺序不可跳过：

1. 根本原因调查
2. 模式分析
3. 假设与验证
4. 实施修复

禁止：

- 猜测式修复
- 一次叠加多个修复
- 在没有复现和证据前“试试看”

如果连续 3 次修复失败：

- 立即停止
- 质疑架构或需求定义
- 与用户讨论

---

## 6. Verification Before Completion

严格遵守 `.cursor/rules/verification-before-completion.mdc`，并在声称“已完成 / 已修复 / 已通过”之前使用 `verification-before-completion` skill。

铁律：

```text
未运行验证命令并查看输出，不得声称任何工作已完成
```

在声明以下内容前，必须有证据：

- “测试通过” -> 测试命令真实输出
- “构建成功” -> 构建命令 exit 0
- “Bug 已修复” -> 原始症状测试通过
- “需求已满足” -> 对照需求逐条核查

禁止使用这些表达：

- “应该能工作了”
- “看起来差不多”
- “可能已经修好了”

---

## 7. Project Documents For Coding Agents

以下两份文档是实现时的直接规格，不是背景材料：

- `docs/current/product-direction.md`
- `docs/current/implementation-status.md`

实现时必须特别遵守这些约束：

- 保持统一对象模型，不按页面各自发明字段
- 将 Agent 协作层作为全局能力设计，不限定为单一 `panel` 形态
- 保持 `Meeting / Account Thread / Deal / Pipeline / Revenue / Task Card / Conversation` 的关系稳定
- 所有 AI 卡片必须支持 explainability
- 所有核心页面必须显示 data freshness / coverage / missing state

---

## 7.1 Current Build Mode

本轮实现不是只做 MVP，而是要把产品方案中的前端页面体系全部开发出来。

当前实现模式强制如下：

- 开发完整前端页面体系
- 不开发业务后端数据
- 所有业务数据使用 mock 构造
- mock 必须覆盖正常、异常、低置信度、数据缺失、同步失败、停滞、风险升高等场景
- Agent 交互使用 `APIkey.md` 中指定的模型供应商 API

允许的唯一非 mock 服务端能力：

- 一个用于模型调用的轻量代理层或 route handler

不允许：

- 开发真实 CRM/会议/邮件/聊天数据后端
- 开发真实数据库或持久化层
- 因为没有后端就跳过 Agent 对话能力

---

## 7.2 Model Integration Rule

最终页面中的 Agent 交互部分必须接入 `APIkey.md` 中提供的模型 API。

实现要求：

- 不要在客户端代码里硬编码 API key
- 优先通过服务端环境变量或本地安全配置读取
- 如果使用 Next.js，可通过 route handler 代理模型请求
- 只代理模型调用，不扩展成业务数据后端
- 所有业务对象仍然来自 mock 数据层

如果 `APIkey.md` 与环境变量冲突：

- 优先以环境变量为运行时来源
- 将 `APIkey.md` 视为本地开发说明或默认来源

禁止：

- 在提交代码时把真实 key 写进源码
- 在 UI 中暴露 key
- 把模型响应和业务 mock 数据耦合成不可替换的实现

---

## 7.3 Mock-First Rule

本项目当前阶段必须先构造 mock 数据，再开始整体前端页面搭建。

顺序要求：

1. 先定义统一对象模型
2. 再构造完整 mock 数据集
3. 再实现页面和组件
4. 最后接入模型对话能力

mock 数据必须覆盖：

- CEO / 销售主管 / 一线销售三类角色视角
- Deal、Meeting、Pipeline、Revenue、Sales Team、Recap、Agent Workflow、Data Sources 等页面场景
- 高健康度 / 低健康度
- 高风险 / 低风险
- 新增商机 / 停滞商机 / 延迟商机
- 数据新鲜 / 过期 / 缺失
- Agent 高置信度 / 低置信度
- 同步成功 / 同步失败 / 待确认

不得在 mock 不完整的情况下直接开始拼页面。

---

## 8. Core Product Semantics

以下语义必须在 UI、状态模型、接口命名中保持一致，禁止混用。

### `suggestion`
AI 生成建议，仅作为候选结果，不代表正式状态。

### `confirm`
用户接受或编辑建议。

### `apply`
将确认后的结果写入系统内部状态。

### `sync`
将已应用的内部状态回写外部系统，如 CRM。

强制要求：

- 不得把 `confirm`、`apply`、`sync` 合并成一个模糊动作
- 不得让用户误以为看到建议就等于系统已更新

### `Pipeline` 拖拽语义

`Pipeline` 看板拖拽默认是 `simulation-first`：

- 拖拽产生提议，不直接修改真实阶段
- 提议必须显示“尚未应用”
- 正式变更需要确认
- 是否同步到 CRM 必须单独决定

---

## 9. Agent-First UX Requirements

任何核心页面都要回答这几个问题：

1. 现在最重要的事情是什么
2. 为什么它重要
3. 下一步该做什么
4. 用户能否继续追问或直接执行

编码实现时必须保证：

- Agent 先给自然语言结论，再给图表
- 用户可以围绕任意结论继续问“为什么”
- 用户可以查看证据
- 用户可以修改、驳回、重跑 Agent 输出
- Agent 语气应像专业销售同事，而不是调试台输出

好的 Agent 文案示例：

- “这个 Deal 风险升高，主要因为预算责任人仍未明确，且最近两次会议没有形成具体下一步。”

不好的文案示例：

- “Risk score increased due to multidimensional inference.”

---

## 10. Explainability Requirements

每个重要 AI 结论卡片至少要有：

- 结论
- 置信度
- 最近更新时间
- 数据时间范围
- 数据覆盖率
- 最多三条关键依据
- 查看证据入口
- 反馈 / 重新生成功能

可作为证据的来源包括：

- 会议转录片段
- 邮件摘要
- 聊天摘要
- CRM 字段变化
- 推进时间线

如果缺少关键数据：

- 明确显示数据不完整
- 降低可信度展示
- 提醒哪些判断暂不应完全采信

---

## 11. Shared Domain Model

实现时优先复用并集中管理这些核心对象：

- `Account`
- `Contact`
- `Deal`
- `Meeting`
- `Conversation`
- `AgentOutput`
- `EvidenceRef`
- `ForecastSnapshot`
- `CoachingReview`

要求：

- 类型定义集中
- 枚举集中
- 页面层只消费共享对象
- 禁止在某个页面里偷偷扩展出不兼容字段名

---

## 12. Required Core Surface

当前主线至少要维护并澄清以下核心 surface：

1. `/home`
2. `/customers`
3. `/meetings/:meetingId`
4. `/deals/:dealId`
5. `/pipeline`
6. `/intake`
7. `/agent-task-cards`
8. `/conversational-agent-os`

当前主线必须优先走通以下能力闭环：

1. 会议理解
2. Account Thread / Deal 投影关系展示
3. Next Step 建议与人工确认
4. Pipeline 风险识别
5. 数据状态透传
6. Raw intake -> suggestion -> confirm -> apply
7. Task Card / Conversation 交互验证

最关键闭环：

```text
会议 / 素材进入系统
-> Agent 生成总结或判断
-> 用户查看证据
-> 用户修正重点
-> Agent 生成 Next Step 或 Task Card
-> 用户确认
-> 应用到内部状态
-> 选择是否同步或继续 handoff
```

如果这个闭环没有走通，说明产品还没有真正收敛到 `Agent-first` 主线。

---

## 13. App Shell And IA Requirements

当前实现必须承认并管理两类壳层：

1. 稳定的 route / object shell
2. 正在探索的 conversation-first shell

强制要求：

- 不得再新增第三种顶层产品叙事而不先收口前两者
- route shell 继续承担对象页、证据页、执行页职责
- conversation-first shell 继续承担主协作、handoff、task-card 验证职责
- 无论壳层如何变化，都不得破坏 meeting-first / account-thread / deal projection 语义

优先构建顺序：

1. shared types and enums
2. reusable cards and badges
3. meeting / thread / deal / pipeline 等主对象语义
4. intake 与 explainability 闭环
5. task-card 与 conversation-first 交互验证
6. 壳层收口与入口收口

不得先做高保真视觉，再补语义和状态。

---

## 13.1 Frontend Design Rule

凡是涉及页面、组件、布局、视觉、交互层的修改，必须遵守：

- `/Users/wayne/.codex/skills/frontend-design/SKILL.md`

强制要求：

- 先确定明确的视觉方向，再写代码
- 不要做通用 SaaS 后台风格
- 不要做“发光卡片堆叠 + 默认聊天侧栏”的 AI 套板
- 优先使用更强的上下层级、节奏和留白，而不是横向堆信息
- 如果内容很多，优先通过分层、折叠、拖拽上下文、对话输入等方式降低认知负担
- Agent 侧边栏必须更像可协作工作区，而不是只会展示固定 prompt 的说明面板

前端设计验收时必须额外检查：

- 是否有明确视觉方向
- 是否避免传统 CRM / BI 大盘既视感
- 是否把最重要的判断放在最强视觉层级
- 是否避免因横向排布导致长文被压成难读窄列

---

## 14. Component And State Guidelines

优先抽取可复用组件，尤其是跨页面复用的：

- `KpiCard`
- `AgentBriefCard`
- `ExplainableCard`
- `HealthScoreRing`
- `RiskTag`
- `StageTag`
- `ConfidenceBadge`
- `DataFreshnessBadge`
- `EvidenceDrawer`
- `Timeline`
- `AgentChatPanel`
- `SuggestionActionCard`

状态管理必须明确区分：

- server state
- UI state
- simulation/proposal state
- draft AI output state

禁止把权威业务对象只放在零散的组件局部状态中。

---

## 15. Error, Empty, And Trust States

必须显式处理以下情况：

- AI 输出不可用
- transcript 缺失
- 数据过期
- CRM 同步失败
- recommendation 低置信度
- pipeline 为空
- deal 无关联会议
- Agent 正在重生成

要求：

- 每种状态都要有明确 UI
- 不允许静默失败
- 不允许用“假正常”掩盖异常状态

---

## 16. Skills Guidance

如果某个 skill 适用，必须使用。

当前项目里最相关的 skills 包括：

- `using-superpowers`
  - 触发：收到任何新任务、准备响应或行动前
  - 要求：先检查是否有适用 skill；只要有适用可能，就先加载对应 skill

- `brainstorming`
  - 触发：新增功能、创意性实现、页面重构、行为修改、方案设计前
  - 要求：先探索上下文、澄清需求、提出方案并获得设计批准，再进入实现计划

- `frontend-design`
  - 触发：构建页面、组件、布局、交互、视觉层次时
  - 要求：先读 skill，再按其方式实现高质量前端

- `writing-plans`
  - 触发：设计获批后、开始任何多步骤实现前
  - 要求：先将计划写入 `docs/plans/YYYY-MM-DD-<topic>.md`，再进入执行

- `executing-plans`
  - 触发：已有批准计划并开始执行时
  - 要求：严格按计划逐步推进，不跳步骤，不擅自扩 scope

- `test-driven-development`
  - 触发：新功能、Bug 修复、重构、行为变更
  - 要求：先写失败测试并验证失败，再写最小实现

- `systematic-debugging`
  - 触发：Bug、测试失败、构建失败、异常行为、集成问题
  - 要求：先完成根因调查，再提出和实施修复

- `verification-before-completion`
  - 触发：准备声称“完成”“修复”“测试通过”“构建成功”之前
  - 要求：先运行对应验证命令并检查输出，再陈述结论

- `writing-skills`
  - 触发：用户要求创建或更新 Codex skill 时
  - 要求：按 skill 规范编写，保持说明可执行、边界明确

如果任务涉及其它已安装 skills，也必须先读取对应 skill 再继续；不要引用当前环境里未安装的 skill 名称作为强制依赖。

---

## 17. Code Quality Rules

- 注释只解释意图、约束、权衡，不解释显而易见代码
- 优先写小函数、单一职责组件和稳定命名
- 错误处理必须显式，禁止吞异常
- 优先降低复杂度，不炫技
- 复用优先于复制粘贴
- 如果一个模式会在 2 个以上页面重复出现，优先抽象组件或 hook

---

## 18. Communication Rules For Agents

与用户沟通时：

- 先说明你要做什么，再开始大规模搜索或改动
- 对不确定的地方先问清楚，不要擅自假设
- 如果发现工作区出现你未预期的改动，立即停止并询问
- 完成后只陈述已经验证过的事实

---

## 19. Definition Of Done

只有在以下条件都满足时，才能声称某项前端工作完成：

1. 行为有失败测试并已转绿
2. 相关验证命令已运行并看过输出
3. 页面语义符合 `Agent-first` 要求
4. AI 结论有可达的证据路径
5. 状态改变动作有明确的确认语义
6. 数据 freshness / missing state 可见
7. 没有偷偷扩 scope

如果这些条件缺失，就只能说：

- “已完成部分实现”
- “已完成代码修改，但尚未验证”
- “已完成 UI 骨架，未完成交互闭环”

不能说“完成了”。
