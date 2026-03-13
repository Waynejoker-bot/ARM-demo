# Current Product Direction

日期：2026-03-13
状态：canonical

## 1. 当前产品定义

AI Sales OS 当前不再被理解为“一个带聊天框的销售后台”。

它的 canonical 定义是：

> 一个以 `Meeting` 为源头、以 `Account Thread` 为持续上下文、以 `Deal` 为正式经营投影、并逐步收敛到 `conversation-first` 协作方式的销售 Agent OS。

## 2. 不变的业务语义基座

以下内容被视为当前不可回退的产品语义：

- `Meeting` 是高价值事实源头，不是附属记录
- `Account Thread` 是客户推进的持续上下文
- `Deal` 是经营投影，不是销售最早打开的主对象
- `suggestion / confirm / apply / sync` 必须分离
- explainability、evidence、freshness、coverage 需要显式可见
- 业务数据继续 mock-first；模型调用只走服务端安全代理

## 3. 当前交互方向

当前交互方向统一收敛为两层：

### 3.1 稳定基座

稳定基座仍是当前 `main` 已有的对象页与执行页：

- Home / Deals / Deal Detail / Meeting Workbench / Pipeline
- Customers / Sales Team / Revenue / Recaps / Data Sources
- Intake 作为上游原始素材输入工作台

这些页面继续承担：

- 证据查看
- 状态确认
- 对象下钻
- 支撑透明层

### 3.2 最新主交互探索

最新想法不是继续堆叠更多 dashboard，而是把交互逐步收敛到：

- `conversational agent os`：thread-first、message-first、detail drill-down
- `task cards`：作为结构化决策载体，而不是零散页面卡片

当前应将这两条路线视为最新交互方向，而不是额外平行产品。

## 4. 当前禁止事项

- 不回到 dashboard-first
- 不把 Agent 降级成右侧说明栏
- 不让 `design-system` 冒充产品主线
- 不再新增未经收口的顶层入口叙事
- 不把历史阶段文档继续当成 live spec

## 5. 当前主线应优先解决的问题

当前最该解决的不是“继续加页面”，而是“收敛顶层叙事和壳层”。

优先级如下：

1. 收敛顶层入口
2. 收敛主交互壳层
3. 保持 meeting-first 语义与 conversation-first 方向一致
4. 让 task card、conversation、detail drill-down 成为同一叙事的不同层

## 6. 文档使用规则

如果任何历史文档与本文件冲突，以本文件为准；如果当前代码与本文件不一致，以 `docs/current/implementation-status.md` 说明的“已实现现实”作为执行基线，再由明确批准决定是否继续收敛。
