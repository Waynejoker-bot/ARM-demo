import Link from "next/link";

import { Badge, SectionCard } from "@/components/shared/ui";
import { deriveRealMeetingHighlights } from "@/lib/derived/real-meeting-highlights";
import { getMockDataset } from "@/lib/mock-selectors";

function toneForPriority(priorityLabel: string) {
  if (priorityLabel === "需高层在场") return "warn" as const;
  if (priorityLabel === "关系维护") return "info" as const;
  return "warn" as const;
}

export function RealMeetingShowcaseSection({
  title,
  limit = 2,
  description,
  showPublicContext = false,
}: {
  title: string;
  limit?: number;
  description?: string;
  showPublicContext?: boolean;
}) {
  const dataset = getMockDataset();
  const highlights = deriveRealMeetingHighlights(dataset.realMeetingCases).slice(0, limit);

  return (
    <SectionCard
      title={title}
      action={
        <Link className="ghost-button" href="/meetings">
          查看全部实录
        </Link>
      }
    >
      {description ? <p className="muted real-highlight-note">{description}</p> : null}
      <div className="stack-list">
        {highlights.map((highlight) => (
          <div className="stack-card real-highlight-card" key={highlight.id}>
            <div className="button-row">
              <Badge tone="info">{highlight.sourceLabel}</Badge>
              <Badge tone="warn">{highlight.ownerLabel}</Badge>
              <Badge tone={toneForPriority(highlight.priorityLabel)}>{highlight.priorityLabel}</Badge>
            </div>
            <strong>{highlight.accountName}</strong>
            <p>{highlight.accountProfile}</p>
            <p className="muted">{highlight.title} · {highlight.statusLabel} · {highlight.metaLine}</p>
            <p>
              <span className="real-highlight-inline-label">核心结论：</span>
              {highlight.insight}
            </p>
            <p>
              <span className="real-highlight-inline-label">下一步动作：</span>
              {highlight.nextStep}
            </p>
            {showPublicContext && highlight.publicContext ? (
              <p className="muted">
                <span className="real-highlight-inline-label">公开补充：</span>
                {highlight.publicContext}
                {highlight.publicSourceLabel && highlight.publicSourceUrl ? (
                  <>
                    {" "}
                    <a href={highlight.publicSourceUrl} target="_blank" rel="noreferrer">
                      {highlight.publicSourceLabel}
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
