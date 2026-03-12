# Mobile Native Action Card Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 把 `/design-system` 中的通用容器、卡片变体和真实卡片墙统一重构为移动端原生行动卡，并保留详情层承接解释与证据。

**Architecture:** 先用失败测试锁定新的阅读语法和交互，再把卡片 mock 数据收敛到同一骨架，最后统一组件与样式。设计系统页继续保留背景方向评审层，但所有卡面都改为短卡、单动作、详情下钻结构。

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, CSS in `app/globals.css`

---

### Task 1: Lock The New Card Vocabulary In Tests

**Files:**
- Modify: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

```tsx
expect(screen.getAllByText("对象").length).toBeGreaterThan(0);
expect(screen.getAllByText("任务").length).toBeGreaterThan(0);
expect(screen.getAllByText("关键判断").length).toBeGreaterThan(0);
expect(screen.getAllByText("信息详情").length).toBeGreaterThan(0);
expect(screen.queryAllByText("一句判断")).toHaveLength(0);
expect(screen.queryAllByText("为什么这么判断")).toHaveLength(0);
expect(screen.queryAllByText("来源与可信度")).toHaveLength(0);
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL because the page still renders the old labels and old card text structure.

**Step 3: Write minimal implementation**

不要写生产代码；此任务只改测试，建立新的目标状态。

**Step 4: Run test to verify it still fails for the right reason**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL with missing `对象/任务/关键判断/信息详情` assertions.

**Step 5: Commit**

```bash
git add tests/unit/pages/design-system-page.test.tsx
git commit -m "test: lock mobile-native action card vocabulary"
```

### Task 2: Reshape Review Data Into Action Card Fields

**Files:**
- Modify: `src/lib/design-system-review-content.ts`
- Modify: `src/lib/design-system-card-wall.ts`
- Test: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

```tsx
expect(screen.getByText("对象")).toBeVisible();
expect(screen.getByText("执行状态")).toBeVisible();
expect(screen.getByRole("button", { name: "锁定二访阵容" })).toBeVisible();
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL because the current mock data still exposes `title/u3/body/trust` instead of the new action-card fields.

**Step 3: Write minimal implementation**

```ts
type ActionCardMetric = {
  label: "可信度" | "执行状态";
  value: string;
};

type ActionCardDetails = {
  reason: string;
  source: string;
  updatedAt: string;
  evidence: string;
  completeness: string;
};
```

把设计评审卡和卡片墙卡片都改成围绕以下字段组织：

```ts
subjectLabel
subject
task
judgment
metric
primaryAction
details
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: Still FAIL until组件层更新，但不再因为数据字段缺失报错。

**Step 5: Commit**

```bash
git add src/lib/design-system-review-content.ts src/lib/design-system-card-wall.ts tests/unit/pages/design-system-page.test.tsx
git commit -m "refactor: reshape design system card data for action cards"
```

### Task 3: Rebuild The Universal Card Container Sample

**Files:**
- Modify: `src/components/design-system/universal-card-container-sample.tsx`
- Test: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

```tsx
expect(screen.getByText("信息详情")).toBeVisible();
expect(screen.getByText("当前状态")).toBeVisible();
expect(screen.getByText("信息来源")).toBeVisible();
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL because the sample still uses the old fixed-slot report-card copy.

**Step 3: Write minimal implementation**

```tsx
<span className="design-slot-label">对象</span>
<span className="design-slot-label">任务</span>
<span className="design-slot-label">关键判断</span>
<span className="design-slot-label">信息详情</span>
```

详情弹层改成：

```tsx
当前状态 / 最近更新 / 信息来源 / 证据 / 数据完整度
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: Passing assertions for the universal container and its drilldown labels.

**Step 5: Commit**

```bash
git add src/components/design-system/universal-card-container-sample.tsx tests/unit/pages/design-system-page.test.tsx
git commit -m "feat: rebuild universal card container as action card"
```

### Task 4: Rebuild The Card Gallery As Native Action Cards

**Files:**
- Modify: `src/components/design-system/design-variant-gallery.tsx`
- Modify: `src/lib/design-system-review-content.ts`
- Test: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

```tsx
expect(screen.getAllByText("关键判断").length).toBeGreaterThan(1);
expect(screen.getByText("广州紫菲网络科技")).toBeVisible();
expect(screen.getByText("1 周内锁定二访阵容")).toBeVisible();
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL because the gallery still renders title/u3/body/trust blocks and dense mobile feed copy.

**Step 3: Write minimal implementation**

```tsx
<div className="design-action-card-copy">
  <span className="design-slot-label">{card.subjectLabel}</span>
  <h3>{card.subject}</h3>
  <span className="design-slot-label">任务</span>
  <p>{card.task}</p>
  <span className="design-slot-label">关键判断</span>
  <p>{card.judgment}</p>
</div>
```

移动端详情页保留解释和证据字段，不再把解释段常驻卡面。

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: Gallery-related assertions pass, with mobile detail dialog still opening.

**Step 5: Commit**

```bash
git add src/components/design-system/design-variant-gallery.tsx src/lib/design-system-review-content.ts tests/unit/pages/design-system-page.test.tsx
git commit -m "feat: convert design gallery to native action cards"
```

### Task 5: Rebuild The Live Card Wall And Reader

**Files:**
- Modify: `src/components/design-system/card-wall.tsx`
- Modify: `src/lib/design-system-card-wall.ts`
- Test: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

```tsx
fireEvent.click(screen.getByRole("button", { name: "打开卡片 广州紫菲网络科技" }));
expect(screen.getByRole("dialog", { name: /广州紫菲网络科技/ })).toBeVisible();
expect(screen.getByText("信息来源")).toBeVisible();
expect(screen.getByText("证据")).toBeVisible();
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL because the reader still uses the old `preview + sections` report view.

**Step 3: Write minimal implementation**

```tsx
<div className="card-wall-preview-meta">
  <span>{card.metric.label}</span>
  <strong>{card.metric.value}</strong>
</div>
<button type="button" className="card-wall-action-button">{card.primaryAction}</button>
```

详情层改成统一字段：

```tsx
为什么这样判断
信息来源
最近更新
证据
数据完整度
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: Card wall opens action-card preview and detail dialog with evidence fields.

**Step 5: Commit**

```bash
git add src/components/design-system/card-wall.tsx src/lib/design-system-card-wall.ts tests/unit/pages/design-system-page.test.tsx
git commit -m "feat: rebuild design system card wall as action cards"
```

### Task 6: Retune The CSS For Mobile-Native Feel

**Files:**
- Modify: `app/globals.css`
- Test: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

No new unit test is necessary here; CSS behavior is covered indirectly by existing DOM structure tests.

**Step 2: Run test to verify baseline still passes or fails only on structure**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: Use current result as baseline before CSS-only changes.

**Step 3: Write minimal implementation**

调整以下样式方向：

- 删除卡中卡式的大区块
- 统一卡片 `padding: 16px 18px`
- 把标题字号收回到移动端原生任务卡级别
- 按钮高度收为 `44px`
- 卡面用更平的底色和更轻的边框/阴影
- 详情页保留纵向滚动和手机全屏体验

**Step 4: Run test to verify it still passes**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/globals.css
git commit -m "style: retune design system cards for native mobile feel"
```

### Task 7: Full Verification

**Files:**
- Verify only

**Step 1: Run targeted tests**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx tests/unit/navigation/navigation-config.test.ts tests/unit/app/app-shell.test.tsx`
Expected: PASS

**Step 2: Run full build**

Run: `npm run build`
Expected: exit code 0

**Step 3: Run public link smoke check**

Run: `curl -I https://waves-zen-clients-manga.trycloudflare.com/design-system && curl -s https://waves-zen-clients-manga.trycloudflare.com/design-system | rg "对象|任务|关键判断|信息详情"`
Expected: `200` plus matched action-card vocabulary.

**Step 4: Review against requirements**

Checklist:
- 设计系统页仍保留 `Background Directions / Universal Card Container / Card Gallery / 卡片墙`
- 卡面统一为行动卡骨架
- 详情层仍保留解释与证据路径
- 不再出现 `一句判断 / 为什么这么判断 / 来源与可信度`

**Step 5: Commit**

```bash
git add .
git commit -m "feat: unify design system cards under mobile-native action cards"
```
