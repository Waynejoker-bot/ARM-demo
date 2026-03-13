> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Single Mainline Consolidation Design

## Context

当前本地已经把 `codex/mobile-shell-adaptation` 和 `codex/raw-intake-workspace` 合并进了 `main`，并且只保留了一个仍在对外服务的 `/design-system` 链接。

剩余风险来自一个仍然存在的旧 worktree：

- `/Users/wayne/Desktop/ARM-demo/.worktrees/codex-agent-task-cards-v1`

这个 worktree 里同时存在三类内容：

1. 主线还没有的新能力
2. 与主线同名但版本不一定更新的页面/样式/测试
3. 明显不该进入主线的临时文件，如 `.playwright-cli` 日志、截图和安装包

用户要求是：

- 只保留一个主线
- 所有修改都合并到一起
- 不要旧的，只保留最新的

## Design Goal

把 `codex-agent-task-cards-v1` worktree 中仍有价值的能力吸收到 `main`，同时避免把当前 `main` 上已经更新过的设计系统、移动端卡片、导航和页面语义回退到旧版本。

最终状态应满足：

- `main` 是唯一继续演进的代码线
- 旧 worktree 不再承担产品能力
- 旧版设计系统和旧公网入口不再存在
- 临时产物不进入主线

## Recommended Approach

采用“能力吸收 + 旧实现淘汰”的收口方式，而不是直接把整个 worktree 生拷贝回 `main`。

具体规则：

1. 对于 `main` 中不存在的新能力：
   - 吸收其实现、路由、测试和必要依赖
   - 例如 `agent-task-cards`、`conversational-agent-os`、对应 API 和持久化模块

2. 对于 `main` 和旧 worktree 同时存在的文件：
   - 以当前 `main` 为基线
   - 逐文件比较，只吸收旧 worktree 中主线缺失的新增语义
   - 不允许用旧 worktree 覆盖已经更新的设计系统、移动端动作卡、会议页和壳层语义

3. 对于临时文件与调试产物：
   - 不合并
   - 统一留在 worktree 侧并最终清理

## Tradeoffs Considered

### 方案 A：整包覆盖

直接把旧 worktree 全量拷回 `main`。

问题：

- 高概率把已经更新的 `/design-system` 和移动端语义回退
- 会把大量临时文件一起带入主线
- 风险最高，不符合“只保留最新”

### 方案 B：只保留当前 main

完全放弃旧 worktree，不吸收任何内容。

问题：

- 会丢掉旧 worktree 里主线还没有的新能力
- 不符合“有修改都合并”

### 方案 C：能力吸收，旧实现淘汰

推荐。

原因：

- 能保住当前主线已经验证过的新设计和现有页面语义
- 还能把旧 worktree 中真正新增的页面和模块纳入主线
- 最符合“都 merge 到一起，但不要旧的”

## Scope To Merge

优先吸收这几类主线缺失能力：

- `app/agent-task-cards/page.tsx`
- `app/conversational-agent-os/page.tsx`
- `app/api/task-cards/actions/route.ts`
- `app/api/conversational-os/*`
- `src/components/task-cards/*`
- `src/components/conversational-os/*`
- `src/lib/task-cards/*`
- `src/lib/conversational-os/*`
- 对应测试

可能需要同步吸收的共享变更：

- `src/lib/navigation.ts` 中新入口
- `src/lib/domain/types.ts` 与 mocks 中新对象
- 必要的样式片段，但不能覆盖当前设计系统的最新结构

## Explicit Non-Goals

这些内容不进入主线：

- `.playwright-cli/*`
- 安装包、日志、截图、yml 记录
- 明显旧于当前 `main` 的 design-system 和移动端卡片版本

## Verification Strategy

合并过程按测试驱动进行：

1. 先把旧 worktree 中新增能力的测试带入 `main`
2. 运行测试，确认在当前 `main` 上失败
3. 再吸收最小实现直到通过
4. 跑完整测试与构建
5. 清理旧 worktree 与旧分支，仅保留 `main`
