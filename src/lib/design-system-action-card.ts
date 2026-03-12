export type ActionCardMetricTone = "default" | "info" | "success" | "warn" | "risk";

export type ActionCardMetric = {
  label: string;
  value: string;
  tone?: ActionCardMetricTone;
};

export type ActionCardDetails = {
  reason: string;
  source: string;
  updatedAt: string;
  evidence: string;
  completeness: string;
};

export type ActionCardRecord = {
  eyebrow: string;
  status: string;
  subjectLabel: string;
  subject: string;
  task: string;
  judgment: string;
  metric: ActionCardMetric;
  primaryAction: string;
  details: ActionCardDetails;
};
