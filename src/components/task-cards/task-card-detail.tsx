"use client";

import Link from "next/link";

import { Badge } from "@/components/shared/ui";
import { SectionCard } from "@/components/shared/ui";
import type { TaskCardDetail as TaskCardDetailModel } from "@/lib/task-cards/types";

function formatVisitDate(occurredAt: string) {
  return occurredAt.slice(0, 10);
}

export function TaskCardDetail({ detail }: { detail: TaskCardDetailModel }) {
  return (
    <div className="task-card-detail-stack">
      <SectionCard title="流转轨迹">
        <div className="stack-list">
          {detail.flowEvents.map((event) => (
            <div className="stack-card" key={event.id}>
              <strong>{event.actorLabel}{event.summary}</strong>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="关键证据">
        <div className="stack-list">
          {detail.evidences.map((evidence) => (
            <div className="stack-card" key={evidence.id}>
              <strong>{evidence.relevanceReason}</strong>
              <p>{evidence.quote}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {detail.companySources.length ? (
        <SectionCard title="公司名来源">
          <div className="stack-list">
            {detail.companySources.map((companySource) => (
              <div className="stack-card" key={companySource.id}>
                <div className="button-row">
                  <Badge tone="info">{companySource.sourceLabel}</Badge>
                  <Badge
                    tone={
                      companySource.companyNameSourceLabel === "原始材料可证" ? "success" : "warn"
                    }
                  >
                    {companySource.companyNameSourceLabel}
                  </Badge>
                </div>
                <strong>{companySource.accountName}</strong>
                <p>{companySource.companyNameSourceNote}</p>
                <p>对应拜访：{formatVisitDate(companySource.occurredAt)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="下钻上下文">
        <div className="stack-list">
          {detail.accounts.map((account) => (
            <div className="stack-card" key={account.id}>
              <strong>{account.name}</strong>
              <p>{account.description}</p>
            </div>
          ))}
          {detail.deals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`} className="ghost-button">
              打开商机：{deal.name}
            </Link>
          ))}
          {detail.meetings.map((meeting) => (
            <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="ghost-button">
              打开会议：{meeting.title}
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
