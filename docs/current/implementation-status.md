# Current Implementation Status

日期：2026-03-18
状态：canonical

## 1. 产品聚焦

已从 25+ 页面路由的 Sales Intelligence 系统，收敛为以一线销售为核心用户、以 4 个 Agent 协作为核心机制的 Conversational Agent OS 工作台。

## 2. Agent 体系已实现

### 一线销售 BPAgent
- [x] Agent 身份标注（"销售 BPAgent"）
- [x] 素材理解：发送会议链接 → 生成摘要卡片
- [x] 追问细节：销售可追问预算、时间线等细节
- [x] confirm → apply：确认后写入客户/商机 Agent
- [x] 日常任务推送：每日 Top 3，标注来源 Agent
- [x] 会议前准备卡片
- [x] 执行闭环：confirm → apply → 可选 sync
- [x] 向上求助：打包上下文上报主管
- [x] 审批结果回传

### 主管 BPAgent
- [x] Agent 身份标注（"主管 BPAgent"）
- [x] 团队状态汇总（3 销售 / 11 商机总览）
- [x] 风险升级通知（商机 Agent 自动升级）
- [x] 审批流程（折扣审批 → 附条件批准 → 回传）
- [x] 辅导建议（会议分析 + 团队对比）

### 客户 Agent
- [x] 卡片标注"来自客户 Agent"
- [x] 健康度变化信号（72 → 68，含变化因子）
- [x] Account Thread 更新确认
- [x] 客户详情页展示"客户 Agent 判断"

### 商机 Agent
- [x] 卡片标注"来自商机 Agent"
- [x] 阶段推进建议（含已满足/缺失条件）
- [x] 风险预警（多因子评分 + 升级主管）
- [x] 下一步行动建议
- [x] 商机详情页展示"来自商机 Agent"

## 3. 会后流程闭环（Post-Meeting Flow）

完整 15 步流程在 seed 数据中预置，PC 端可完整走通：

1. 销售发送会议链接
2. BPAgent 接收识别
3. 生成会议摘要卡片
4. 销售追问细节
5. BPAgent 回答
6. 销售 confirm 摘要
7. BPAgent apply 到客户/商机 Agent
8. 客户 Agent 健康度变化
9. 商机 Agent 阶段/风险/下一步
10. 销售收到新卡片
11. 销售 confirm 下一步
12. apply 商机状态
13. 商机回写客户 Agent
14. 风险升级通知主管
15. 主管查看/决策

## 4. 导航与路由

导航 3 项：

- `/` — Conversational Agent OS（主入口）
- `/pipeline` — 商机管道
- `/settings` — 设置

下钻页面（不在导航中）：

- `/meetings/:id` — 会议工作台（含"会后 Agent 分析"）
- `/deals/:id` — 商机详情（含"来自商机 Agent"标注）
- `/customers/:id` — 客户详情（含"客户 Agent 判断"）

15 个历史页面已 redirect 到 `/`。

## 5. 移动端适配

- 首页直接进入聊天界面（跳过线程列表）
- WeChat 风格消息气泡（头像 + 左右对齐）
- 顶部线程切换 tabs（未读红点）
- 底部固定输入栏
- 3 栏底部导航

## 6. 对话系统

- 2 个线程：杨文星的工作台（一线销售）、刘建明的工作台（主管）
- 12 张决策卡片，每张标注 sourceAgent
- 3 种交互：确认、上报、审批
- 模型调用：GLM API，服务端代理
- 持久化：SQLite

## 7. 测试状态

- 43 个测试文件，141 个测试用例，全部通过
- `next build` 通过，无 TypeScript 错误

## 8. 当前未实现

- 真实多模态解析（录音转文字、图片 OCR）
- 真实 CRM 同步（sync 动作为前端状态）
- 真实数据库（业务数据全 mock）
- 权限和角色切换
- 素材上传完全整合进对话（当前 intake 页面独立存在）
