# Current Product Direction

日期：2026-03-14
状态：canonical

## 1. 当前产品定义

AI Sales OS 是一个以一线销售为核心用户的 Agent 协同工作台。

canonical 定义：

> 一个以 Conversational Agent OS 为唯一主入口、以多模态素材上传为驱动、帮助一线销售从获客到成交全链路提效的 Agent 协同工作台。

产品阶段：演示原型（Demo Prototype）。

## 2. 核心用户与场景

- **核心用户**：一线销售
- **核心场景**：全销售周期——从发现客户到推进成交
- **Agent 交互**：混合模式——Agent 主动推送任务卡片 + 销售随时对话追问
- **数据输入**：多模态素材上传（会议录音、聊天截图、邮件、链接、文字等）

## 3. 核心闭环

唯一需要走通的闭环：

```
销售上传素材 → Agent 理解识别 → 推送结构化卡片 → 销售对话追问
→ Agent 辅助执行 → 销售确认执行（confirm → apply → 可选 sync）→ 新素材进入
```

## 4. 不变的业务语义

- `suggestion / confirm / apply / sync` 必须分离
- explainability、evidence、freshness 需要显式可见
- 业务数据继续 mock-first；模型调用只走服务端安全代理
- `Meeting` 仍是高价值事实源头

## 5. 页面结构

### 5.1 用户直接使用的页面

| 路由 | 定位 |
|------|------|
| `/` | 唯一主入口（Conversational Agent OS） |
| `/pipeline` | Pipeline 看板（辅助视图） |
| `/settings` | 设置 |
| `/design-system` | 仅开发评审用 |

### 5.2 下钻页面（从对话卡片跳入，不在导航中）

- `/meetings/:meetingId` — 会议工作台
- `/deals/:dealId` — Deal 详情
- `/customers/:customerId` — 客户详情

### 5.3 隐藏页面（代码保留，不对用户暴露）

所有其他页面路由保留代码但从导航中移除，仅作为 Agent 内部数据源或未来扩展用。

## 6. 当前禁止事项

- 不回到 dashboard-first
- 不把 Agent 降级成页面侧边说明栏
- 不增加新的顶层入口叙事
- 不做 CEO/销售主管专属视图（demo 聚焦一线销售）
- 不做复杂的权限和角色切换

## 7. 文档使用规则

如果任何历史文档与本文件冲突，以本文件为准。
