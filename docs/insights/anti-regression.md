# Anti-Regression Guardrails

日期：2026-03-13
状态：insight

## 1. 不要回到 dashboard-first

如果一个页面首先呈现 KPI、表格、图表，而 Agent 只是解释附属物，那么它就在往旧路回退。

正确顺序应是：

- 先说最重要的判断
- 再说明为什么
- 再给动作
- 最后给证据和对象下钻

## 2. 不要把 Agent 降级成右侧说明栏

Agent 的价值不是“解释这页有什么”，而是“围绕当前业务上下文协作决策”。

无论未来壳层是 route-first 还是 conversation-first，都不能把 Agent 重新变成一个固定提示面板。

## 3. 不要并存多个顶层产品叙事

以下叙事不能长期平级并存：

- 角色首页是主入口
- 对象页是主入口
- task-card 是主入口
- conversational os 是主入口

允许阶段性探索，但必须有一个被明确宣布的 canonical 入口。

## 4. 不要把 design-system 评审面当成产品主线

`design-system` 的价值是帮助判断阅读语法、卡片骨架和视觉方向。

它不是产品导航意义上的主入口，也不应替代业务语义文档。

## 5. 不要忽略“已实现现实”

最新想法不等于当前代码已经收敛完成。

因此任何新实现都必须同时看：

- `docs/current/product-direction.md`
- `docs/current/implementation-status.md`

方向和现实必须一起读，不能只看其中一边。
