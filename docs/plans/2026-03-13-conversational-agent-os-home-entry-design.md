# Conversational Agent OS Home Entry Design

## Why

当前 `main` 同时保留了：

- `/home` 角色首页
- `/conversational-agent-os` 会话首页
- 顶部与侧边导航里重复的首页叙事

这让第一入口继续分裂，也让 `task card` 和 `conversation` 看起来像并列产品，而不是同一套协作结构中的不同层级。

这轮收口的目标不是再加一个新首页，而是明确：

- 唯一首页是 `/conversational-agent-os`
- `/` 与 `/home` 只是同一首页的入口别名
- `conversation` 是首页容器
- `task card` 是消息流里的结构化 payload

## Approaches Considered

### 1. 保留 `/home`，把会话版继续当实验页

- 优点：改动最小
- 缺点：顶层入口继续分裂，违背当前 canonical 文档里的“收敛主交互壳层”

### 2. 让 `/conversational-agent-os` 成为唯一首页（推荐）

- `/`、`/home`、导航首页都收敛到会话版首页语义
- `task card` 继续留在消息流内，不再作为并列入口
- 能直接把 conversation-first 确认为第一入口

### 3. 首页直接变成任务总队列

- 优点：控制台感强
- 缺点：会滑回 inbox / dashboard-first，不符合当前用户决策

## Design Decision

采用方案 2：`/conversational-agent-os` 成为唯一首页语义。

这轮首页按以下产品假设落地：

- 当前默认身份是 `超级管理员`
- 超级管理员能看到所有 conversation
- 只要能看到某条 conversation，就能看到其中全部内容
- 权限细分和 source material 输入留到后续迭代

## Homepage IA

### Canonical Route

- canonical homepage: `/conversational-agent-os`
- alias routes: `/`、`/home`
- 侧边栏与移动底部导航的 `首页` 都直接指向 `/conversational-agent-os`
- 不再把 `会话版 Agent OS` 作为与 `首页` 并列的第二入口

### Desktop First Screen

桌面端首页采用会话优先的两栏半结构：

- 左栏：按角色分组的 conversation list
- 中栏：当前 active conversation
- 右侧 detail：默认收起，手动打开

桌面首次进入时：

- 自动选中最近活跃的 conversation
- 不渲染独立 dashboard 区
- 不渲染全局任务总表

### Mobile First Screen

移动端首页先进入 conversation list。

移动端层级：

1. 会话列表
2. 单条会话
3. 详情下钻

移动端不会在首次打开时自动进入最近活跃线程，否则首页入口会被吞掉。

## Conversation List Structure

首页列表按角色组织，而不是按对象页或风险总表组织。

角色分组顺序固定为：

1. CEO
2. 销售主管
3. 一线销售

每组内按最近活跃时间倒序。

每条会话卡只保留：

- 标题
- 角色标签
- 最近活跃时间
- 未读状态
- 一行轻量状态

不再保留：

- 多行说明正文
- “当前最重要”大块说明
- 会和主舞台竞争的长摘要

## Main Conversation Surface

首页主舞台继续保持 message-first：

- 顶部：当前线程标题、可见角色、最近活跃时间
- 中部：消息流
- 消息中的卡片：`task card` 作为结构化消息块
- 底部：只保留“回消息/追问/确认”的回复输入

这轮首页不做 source material 发送入口，输入区文案也不再引导上传原始材料。

## Detail Layer

详情层不是首页主舞台的一部分，而是对当前消息或卡片的手动下钻。

规则：

- 桌面端默认收起
- 用户点击 `查看详情` 后打开
- 已打开时允许关闭，回到单主舞台阅读
- 移动端继续保持 push-navigation detail screen

## Relationship To Meeting-First

首页壳层收敛为 `conversation-first`，但业务语义不改：

- `Meeting` 仍是事实源头
- `Account Thread` 是持续上下文
- `Deal` 是经营投影
- `Conversation` 是协作容器
- `Task Card` 是结构化决策原子

因此首页不是“聊天替代一切”，而是：

`Meeting / source evidence -> conversation -> task card -> confirm / apply / sync -> object pages`

## Scope

In scope:

- 首页路由收敛到 `/conversational-agent-os`
- `/` 与 `/home` 复用同一首页输出
- conversation list 按角色分组
- 桌面默认打开最近活跃会话
- 桌面 detail 默认收起
- composer 收敛为回消息语义
- 导航删除并列的第二个会话首页入口

Out of scope:

- 真实权限系统
- source material 上传能力
- 新的 route-level conversation history
- 将所有对象页折叠进 conversation 首页

## Acceptance Criteria

- `/`、`/home`、`/conversational-agent-os` 呈现同一首页语义
- 侧边栏和移动导航的 `首页` 指向 `/conversational-agent-os`
- 不再同时存在 `首页` 与 `会话版 Agent OS` 两个顶层入口
- 桌面端默认进入最近活跃的 conversation
- conversation list 按 `CEO / 销售主管 / 一线销售` 分组
- 桌面端首次进入时不显示 detail 面板
- 输入区只表达“回消息/追问/确认”，不引导 source material 上传
