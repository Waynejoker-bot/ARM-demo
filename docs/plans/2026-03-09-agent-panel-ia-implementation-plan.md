# Agent Panel IA Implementation Plan

日期：2026-03-09

状态：待执行

关联设计：

- `docs/plans/2026-03-09-agent-panel-ia-design.md`

范围：

- 只重构右侧 Agent 面板的信息架构和输入区布局
- 不改变模型请求能力边界
- 不改变三个角色工作台的主内容区

目标：

- 去掉冗余说明
- 压缩附件表达
- 输入框成为主视觉焦点
- 发送按钮内嵌进输入区

---

## 1. 实施策略

按以下顺序执行：

1. 写失败测试
2. 重构 Agent 面板组件结构
3. 收缩文案层级与快捷问题
4. 重构输入区和发送按钮
5. 跑全量验证

---

## 2. 文件变更计划

### 2.1 测试

修改：

- `tests/unit/agent/agent-panel.test.tsx`

新增断言：

- Header 不再显示大段页面描述
- 存在简短任务条
- 附件只显示紧凑 chip，不显示“决策卡上下文”大标题
- 输入区不再显示说明段落
- 快捷问题最多 2 个
- 发送按钮内嵌在输入区容器内

### 2.2 组件

修改：

- `src/components/agent/agent-panel.tsx`

目标：

- 删除大段页面描述
- 删除当前页上下文说明卡
- 新增 `Task Strip`
- 附件区改为紧凑 chip strip
- 输入区改为单一主交互区
- 发送按钮改为图标内嵌按钮

### 2.3 样式

修改：

- `app/globals.css`

目标：

- 右栏层级更像任务对话区
- 输入区视觉成为主焦点
- 附件 chip 更轻量
- 快捷问题更弱化
- 去掉不必要的大块说明容器

---

## 3. TDD 步骤

### Step 1

修改 `tests/unit/agent/agent-panel.test.tsx`

新增失败断言：

- 不显示 `当前页上下文`
- 不显示输入区帮助段落
- `发送给 Agent` 按钮作为图标按钮位于输入区内
- 快捷问题数量不超过 2

运行：

- `npm run test -- tests/unit/agent/agent-panel.test.tsx`

预期：

- 失败，原因是当前 Agent 面板仍有冗余结构

### Step 2

重构 `src/components/agent/agent-panel.tsx`

实现：

- `Task Strip`
- 紧凑附件条
- 输入区内嵌发送按钮
- 只保留 2 个短快捷问题

### Step 3

修改 `app/globals.css`

实现：

- 新的输入区 shell
- 小型发送图标按钮
- 轻量附件条
- 更紧凑的 header 与 task strip

### Step 4

运行：

- `npm run test -- tests/unit/agent/agent-panel.test.tsx`

预期：

- 通过

### Step 5

运行全量验证：

- `npm run test`
- `npm run build`

---

## 4. 非目标

本轮不做：

- 聊天历史持久化
- 多类型附件
- 新增对话工具栏
- 改造主内容区卡片结构
