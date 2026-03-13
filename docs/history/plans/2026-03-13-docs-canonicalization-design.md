> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Documentation Canonicalization Design

日期：2026-03-13
状态：已批准

## 1. 背景

当前仓库的产品文档已经跨越多轮转向：

- 从 full mock 前端范围定义起步
- 经过 role workspace、meeting-first、mobile shell、raw intake
- 又加入 design-system、task-card、conversational agent os 等探索

问题不是文档数量多，而是三类内容混在一起：

1. 当前仍应指导实现的 canonical 文档
2. 已经过时但有复盘价值的历史方案
3. 尚在探索中的新方向与实验记录

结果是任何新 agent 或协作者进入仓库时，都难以快速判断：

- 现在真正要遵守哪一套产品叙事
- 哪些文档只是历史，不应再继续执行
- 哪些文档属于探索，不应误当成当前主线

## 2. 目标

本轮不是继续补新产品方案，而是给现有文档体系做一次收口。

目标只有四个：

1. 为仓库建立单一的 canonical 文档入口
2. 将历史设计与计划显式归档，避免误读
3. 提炼当前最新的产品想法、洞察和边界
4. 形成一份“避免走回头路”的反模式总结

## 3. 设计原则

### 3.1 当前、历史、洞察分层

文档应分成三层：

- `docs/current/`：当前唯一应被优先阅读和遵守的文档
- `docs/history/`：历史设计、实现计划、阶段性产物
- `docs/insights/`：历史总结、反模式、重要产品洞察

### 3.2 当前层只保留最少集合

`docs/current/` 不做资料馆，只保留当前主线最需要的少量文件：

- 文档入口
- 当前产品方向
- 当前实现状态

如果某份旧文档仍有价值，应被吸收到新的 current 文档中，而不是继续平铺保留。

### 3.3 历史文档保留，但必须显式标记

历史文档不能删除，因为它们记录了为什么会转向。

但历史文档必须具备三个标记：

- `Status: archived`
- `Archived because`
- `Superseded by`

这样后续任何人打开旧文档时，都能立刻知道它已不再指导主线实现。

### 3.4 把“当前主线”表述成一条连续叙事

当前 canonical 想法应统一表达为：

- `meeting-first` 是业务语义基座
- `account thread` 是持续上下文
- `deal` 是经营投影，不是源头对象
- `raw intake` 是上游输入链路
- `conversational agent os` 是当前最新主交互探索

这条叙事必须清晰到足以替代大量历史文档的分散表述。

### 3.5 历史总结必须变成反回退护栏

历史总结不能只是时间线，而要回答：

- 我们为什么放弃 dashboard-first
- 为什么不能把 Agent 降级成右侧说明栏
- 为什么不要并存多个顶层入口叙事
- 为什么 design-system 实验页不应冒充产品主线

## 4. 推荐信息架构

```text
docs/
  current/
    README.md
    product-direction.md
    implementation-status.md
  history/
    README.md
    plans/
      ...
  insights/
    README.md
    historical-summary.md
    anti-regression.md
```

## 5. Canonical 文档定义

### 5.1 `docs/current/README.md`

唯一入口，回答：

- 先读什么
- 当前主线是什么
- 代码当前落地到哪里
- 历史和探索文档在哪里

### 5.2 `docs/current/product-direction.md`

吸收当前仍然有效的产品定义，统一替代分散在多份旧设计中的主叙事。

### 5.3 `docs/current/implementation-status.md`

解释当前 `main` 已经实现了什么、还没收敛什么，避免文档只讲理想不讲现实。

## 6. 历史归档策略

以下内容进入 `docs/history/plans/`：

- 旧设计稿
- 旧 implementation plan
- 已完成的阶段性整合方案
- 已经被新 canonical 文档吸收的路线说明

保留原文件名，避免丢失 git 历史语义。

## 7. AGENTS 与入口更新

`AGENTS.md` 需要同步收口：

- Source of truth 不再平铺一长串互相交织的旧文档
- 优先指向新的 `docs/current/*`
- 同时保留少量仍需直接引用的根文档

## 8. 非目标

本轮不做这些事：

- 不删除代码中的实验路由
- 不重写具体产品功能
- 不重新定义信息架构本身
- 不合并或改写所有根级产品文档正文

本轮只做文档层级整理、状态标记和入口收口。
