import { notFound } from "next/navigation";

import { RoleWorkspaceView } from "@/components/workspaces/decision-cards";
import { getRoleWorkspaceBySlug } from "@/lib/role-workspaces";

export default function CeoCommandCenterPage() {
  const workspace = getRoleWorkspaceBySlug("ceo-command-center");

  if (!workspace) {
    notFound();
  }

  return <RoleWorkspaceView workspace={workspace} />;
}
