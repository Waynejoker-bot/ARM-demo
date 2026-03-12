function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toLocalParts(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

function formatMonthDay(value: ReturnType<typeof toLocalParts>) {
  return `${pad(value.month)}-${pad(value.day)} ${pad(value.hours)}:${pad(value.minutes)}`;
}

export function formatAbsoluteConversationTime(value: string | Date) {
  const parts = toLocalParts(value);

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hours)}:${pad(parts.minutes)}`;
}

export function formatRelativeConversationTime(value: string | Date, nowValue: Date = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const now = nowValue instanceof Date ? nowValue : new Date(nowValue);
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 60_000) {
    return "刚刚";
  }

  if (diffMs < 3_600_000) {
    return `${Math.floor(diffMs / 60_000)} 分钟前`;
  }

  const dateParts = toLocalParts(date);
  const nowParts = toLocalParts(now);
  const startOfToday = new Date(nowParts.year, nowParts.month - 1, nowParts.day);
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);

  if (date >= startOfToday) {
    return `今天 ${pad(dateParts.hours)}:${pad(dateParts.minutes)}`;
  }

  if (date >= startOfYesterday) {
    return `昨天 ${pad(dateParts.hours)}:${pad(dateParts.minutes)}`;
  }

  return formatMonthDay(dateParts);
}
