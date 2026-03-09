import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="stack-card">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function ErrorState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="stack-card">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="stack-card">
      <strong>{label}</strong>
      <p>正在加载，请稍候...</p>
    </div>
  );
}

export function LabeledValue({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="stack-card">
      <strong>{label}</strong>
      <div>{children}</div>
    </div>
  );
}
