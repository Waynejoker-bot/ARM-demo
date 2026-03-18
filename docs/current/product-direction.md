# Current Product Direction

日期：2026-03-18
状态：canonical

## 1. 当前产品定义

AI Revenue Management OS 是一个以一线销售为核心用户、以 4 个专业 Agent 协作为核心机制的对话式工作台。

canonical 定义：

> 一个以 Conversational Agent OS 为唯一主入口、以多模态素材上传为驱动、通过 BPAgent（Business Partner Agent）+ 客户 Agent + 商机 Agent 多 Agent 协作，帮助一线销售从获客到成交全链路提效的 Agent 协同工作台。

产品阶段：演示原型（Demo Prototype）。

## 2. Agent 架构

| Agent | 类型 | 实例化 | 定义 |
|-------|------|--------|------|
| 一线销售 BPAgent | BPAgent | 1 销售 = 1 实例 | 销售的业务伙伴，帮助理解素材、推进商机、闭环执行 |
| 主管 BPAgent | BPAgent | 1 主管 = 1 实例 | 主管的业务伙伴，帮助管人、管事、管资源 |
| 客户 Agent | 客户 Agent | 1 客户 = 1 实例 | 客户的数字记忆体，维护生命周期和关系上下文 |
| 商机 Agent | 客户 Agent 子集 | 1 商机 = 1 实例 | 商机的专属管家，管理从立项到成交的全流程 |

关键区分：BPAgent 面向人（对话交互），客户/商机 Agent 面向对象（为 BPAgent 提供事实和判断）。

## 3. 核心用户与场景

- **核心用户**：一线销售
- **核心场景**：会后闭环——参加完会议，发送素材给 BPAgent，Agent 自动处理
- **Agent 交互**：混合模式——Agent 主动推送卡片 + 销售随时对话追问
- **数据输入**：多模态素材上传（会议录音、聊天截图、邮件、链接、文字等）

## 4. 核心闭环

```
销售发送会议链接 → BPAgent 理解生成摘要卡片 → 销售追问/confirm
→ apply 到客户 Agent（Account Thread 更新）
→ 商机 Agent 响应（阶段推进/风险/下一步）
→ 销售 confirm 下一步 → apply
→ 风险升高自动通知主管 BPAgent
```

## 5. 页面结构

### 5.1 用户直接使用的页面

| 路由 | 定位 |
|------|------|
| `/` | 唯一主入口（Conversational Agent OS） |
| `/pipeline` | Pipeline 看板（辅助视图） |
| `/settings` | 设置 |

### 5.2 下钻页面（从对话卡片跳入，不在导航中）

- `/meetings/:meetingId` — 会议工作台
- `/deals/:dealId` — Deal 详情
- `/customers/:customerId` — 客户详情

### 5.3 隐藏页面

15 个历史页面路由已 redirect 到 `/`，代码保留但不对用户暴露。

## 6. 不变的业务语义

- `suggestion / confirm / apply / sync` 必须分离
- 每张卡片标注来源 Agent
- explainability、evidence、freshness 显式可见
- 会议是核心事实源

## 7. 当前禁止事项

- 不回到 dashboard-first
- 不把 Agent 降级成页面侧边说明栏
- 不增加新的顶层入口叙事
- 不做 CEO 专属视图

## 8. 文档使用规则

如果任何历史文档与本文件冲突，以本文件为准。
Agent 规格详见 `docs/current/agent-specifications.md`。
