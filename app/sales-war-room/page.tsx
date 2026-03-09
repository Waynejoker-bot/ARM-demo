import { notFound } from "next/navigation";

import { RoleWorkspaceView } from "@/components/workspaces/decision-cards";
import { getRoleWorkspaceBySlug } from "@/lib/role-workspaces";

export default function SalesWarRoomPage() {
  const workspace = getRoleWorkspaceBySlug("sales-war-room");

  if (!workspace) {
    notFound();
  }

  return <RoleWorkspaceView workspace={workspace} />;
}
