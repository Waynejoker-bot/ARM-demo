"use client";

import { useState } from "react";

import { Badge } from "@/components/shared/ui";

export function UniversalCardContainerSample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="design-shell-showcase">
        <article className="design-shell-card">
          <div className="design-shell-topline">
            <Badge tone="info">固定骨架</Badge>
            <Badge tone="success">行动优先</Badge>
          </div>

          <div className="action-card-body design-shell-body">
            <div className="action-card-group">
              <span className="action-card-label">对象</span>
              <div className="action-card-subject">
                <strong>广州紫菲网络科技</strong>
              </div>
            </div>

            <div className="action-card-group">
              <span className="action-card-label">任务</span>
              <p>1 周内锁定二访阵容</p>
            </div>

            <div className="action-card-group">
              <span className="action-card-label">关键判断</span>
              <p className="action-card-judgment">先锁二访，不继续堆产品信息。</p>
            </div>
          </div>

          <div className="action-card-footer design-shell-footer">
            <div className="action-card-metric">
              <span className="action-card-label">可信度</span>
              <Badge tone="success">82%</Badge>
            </div>

            <div className="action-card-action">
              <span className="action-card-label">下一步</span>
              <button type="button" className="primary-button">
                锁定二访阵容
              </button>
            </div>
          </div>

          <div className="design-shell-detail-row">
            <span className="action-card-label">信息详情</span>
            <button
              type="button"
              className="secondary-button design-detail-trigger"
              aria-label="查看信息详情"
              onClick={() => setIsOpen(true)}
            >
              查看信息详情
            </button>
          </div>
        </article>
      </div>

      {isOpen ? (
        <div className="design-card-dialog-backdrop" onClick={() => setIsOpen(false)}>
          <section
            className="design-drilldown-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="信息详情样本"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="design-drilldown-dialog-header">
              <div>
                <span className="action-card-label">信息详情</span>
                <h3>移动端原生行动卡</h3>
              </div>

              <button
                type="button"
                className="ghost-button"
                aria-label="关闭详情"
                onClick={() => setIsOpen(false)}
              >
                关闭详情
              </button>
            </div>

            <div className="action-card-detail-sections design-drilldown-dialog-grid">
              <section className="action-card-detail-section">
                <span className="action-card-detail-label">当前状态</span>
                <p>已由销售确认，尚未回写外部系统。</p>
              </section>

              <section className="action-card-detail-section">
                <span className="action-card-detail-label">最近更新</span>
                <p>2026 年 3 月 12 日 00:10</p>
              </section>

              <section className="action-card-detail-section">
                <span className="action-card-detail-label">信息来源</span>
                <p>会议录音、客户线程变化、销售确认记录</p>
              </section>

              <section className="action-card-detail-section">
                <span className="action-card-detail-label">证据</span>
                <p>客户明确要求下一次会必须带技术负责人和试点 owner。</p>
              </section>

              <section className="action-card-detail-section">
                <span className="action-card-detail-label">数据完整度</span>
                <p>原始录音和 CRM 已齐，预算表缺失。</p>
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
