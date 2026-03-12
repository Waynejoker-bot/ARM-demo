import { unstable_noStore as noStore } from "next/cache";

import { ConversationalAgentOsPageView } from "@/components/conversational-os/page";
import { defaultThreadId } from "@/lib/conversational-os/seed";
import { createConversationRuntime } from "@/lib/conversational-os/runtime";

export default function ConversationalAgentOsPage() {
  noStore();

  const runtime = createConversationRuntime();
  const initialThread = runtime.openThread(defaultThreadId);

  return (
    <ConversationalAgentOsPageView
      initialDefaultThreadId={defaultThreadId}
      initialThreadPreviews={runtime.listThreadPreviews()}
      initialThread={initialThread}
    />
  );
}
