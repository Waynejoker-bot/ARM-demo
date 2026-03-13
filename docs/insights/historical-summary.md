# Historical Summary

日期：2026-03-13
状态：insight

## 1. 项目演进主线

### Phase 1：全量 mock 前端范围建立

最早的核心动作不是定视觉，而是把范围从小型 MVP 提升到完整前端页面体系。

这一步的价值是明确了：

- 先做 mock-first
- 先做共享对象模型
- 只允许服务端模型代理，不做真实业务后端

### Phase 2：反 dashboard-first，提出角色工作台

第二步开始意识到“更好看的 CRM 首页”不是目标。

这一步带来的洞察是：

- 首页应该先讲现在最重要的判断
- Agent 不能只是解释器
- 顶层页面应该比对象列表更接近决策编排层

### Phase 3：meeting-first / account-thread / deal projection 定型

这是最关键的一次产品定型。

从这一阶段开始，主叙事变成：

- `Meeting` 是信息源头
- `Account Thread` 是持续推进上下文
- `Deal` 是经营投影

这一步把产品从“CRM 变体”拉回到“销售推进操作系统”。

### Phase 4：mobile shell 与 intake 把系统补完整

后续演进没有改变业务基座，而是在补主线能力：

- mobile shell 让同一路由在手机上可用
- raw intake 让原始素材也能进入 Agent-first 链路

这一步是合理扩展，不是方向漂移。

### Phase 5：design-system、task-card、conversational os 进入探索

再往后，团队开始集中探索新的交互壳层：

- design-system / mobile action cards
- task-card page
- conversational agent os

这些探索的共同目标是：

- 不再把 Agent 放在页面边缘
- 让决策卡和会话成为主交互对象
- 让 detail drill-down 承担解释与证据，而不是让首页继续堆摘要

## 2. 这条演进说明了什么

项目不是“越做越乱”，而是每一轮都在尝试纠正上一轮残留的问题。

真正的问题不在于转型本身，而在于：

- 旧层经常没有被正式下线
- 多代叙事长期并存
- 历史文档没有被及时归档，导致新旧判断互相覆盖

## 3. 当前应该如何使用这段历史

历史最大的价值不是告诉我们要回到哪一版，而是告诉我们：

- 哪些判断已经被验证为正确方向
- 哪些回退会让产品重新滑回 CRM / BI 思维
- 哪些实验是主线收敛前必须保留的探索
