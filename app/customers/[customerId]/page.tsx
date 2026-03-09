import { notFound } from "next/navigation";

import { AccountThreadDetailView } from "@/components/threads/account-thread-panels";
import { getAccountById, getAccountThreadById } from "@/lib/mock-selectors";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const account = getAccountById(customerId);
  const thread = getAccountThreadById(customerId);

  if (!account || !thread) {
    notFound();
  }

  return <AccountThreadDetailView accountId={customerId} />;
}
