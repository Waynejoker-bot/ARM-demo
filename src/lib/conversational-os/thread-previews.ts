import type { ConversationThreadPreview } from "@/lib/conversational-os/runtime";

const roleOrder: ConversationThreadPreview["primaryRole"][] = ["ceo", "manager", "rep"];

export function getThreadRoleLabel(role: ConversationThreadPreview["primaryRole"]) {
  if (role === "rep") return "一线销售";
  if (role === "manager") return "销售主管";
  return "CEO";
}

function getThreadActivityTimestamp(preview: ConversationThreadPreview) {
  return preview.latestMessage?.occurredAt ?? preview.pinnedCard?.createdAt ?? "";
}

export function sortThreadPreviewsByActivity(previews: ConversationThreadPreview[]) {
  return [...previews].sort((left, right) => {
    const rightActivity = getThreadActivityTimestamp(right);
    const leftActivity = getThreadActivityTimestamp(left);

    if (rightActivity !== leftActivity) {
      return rightActivity.localeCompare(leftActivity);
    }

    const roleDelta = roleOrder.indexOf(left.primaryRole) - roleOrder.indexOf(right.primaryRole);
    if (roleDelta !== 0) {
      return roleDelta;
    }

    return left.title.localeCompare(right.title, "zh-Hans-CN");
  });
}

export function getMostRecentlyActiveThreadId(previews: ConversationThreadPreview[]) {
  return sortThreadPreviewsByActivity(previews)[0]?.id ?? null;
}

export function groupThreadPreviewsByRole(previews: ConversationThreadPreview[]) {
  return roleOrder
    .map((role) => ({
      role,
      label: getThreadRoleLabel(role),
      threads: sortThreadPreviewsByActivity(previews.filter((preview) => preview.primaryRole === role)),
    }))
    .filter((group) => group.threads.length > 0);
}
