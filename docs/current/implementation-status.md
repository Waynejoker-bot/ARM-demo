# Current Implementation Status

日期：2026-03-13
状态：canonical

## 1. 当前 `main` 已有能力

当前主线已经不是早期骨架，而是一个可运行的 full-surface mock prototype。

已落地的主要能力包括：

- 角色与对象页：`/home`、`/deals`、`/deals/:dealId`、`/meetings`、`/meetings/:meetingId`、`/pipeline`、`/customers`、`/sales-team`、`/revenue`、`/recaps`、`/data-sources`、`/settings`
- meeting-first 中层：meeting workbench、account thread、deal projection、pipeline simulation
- 上游输入：`/intake` + GLM 识别路由
- 交互实验：`/agent-task-cards`、`/conversational-agent-os`
- 设计评审面：`/design-system`
- 模型路由：`/api/agent/chat`、`/api/intake/classify`、`/api/conversational-os/*`、`/api/task-cards/actions`

## 2. 当前仓库的真实状态判断

当前主线已经具备：

- meeting-first 语义基座
- confirm/apply/sync 等状态语义
- mobile shell 适配
- intake 链路
- task-card 与 conversation-first 的实验能力

但它仍未完全收敛，主要体现在：

- `/home`、角色工作台、task-card、conversational-agent-os 并存
- route shell 与 conversation-first shell 并存
- `design-system` 仍在导航中，容易被误解为产品主线

## 3. 当前执行建议

在没有新的明确批准前，后续工作应按以下方式理解当前代码：

- 对象页与详情页：稳定执行基座
- `intake`：已进入主线能力
- `agent-task-cards` 与 `conversational-agent-os`：当前主交互探索面
- `design-system`：内部评审面，不应等同于产品入口

## 4. 当前文档与代码的关系

- `docs/current/product-direction.md` 定义当前 canonical 方向
- 本文件定义“当前代码到底落在哪里”
- `docs/history/` 中的内容只用于复盘，不应用来直接指导新实现
