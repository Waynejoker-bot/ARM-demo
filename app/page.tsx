import { unstable_noStore as noStore } from "next/cache";

import { ConversationalAgentOsPageView } from "@/components/conversational-os/page";
import { defaultThreadId } from "@/lib/conversational-os/seed";
import { createConversationRuntime } from "@/lib/conversational-os/runtime";
import { getMostRecentlyActiveThreadId } from "@/lib/conversational-os/thread-previews";

export default function Page() {
  noStore();

  const runtime = createConversationRuntime();
  const initialThreadPreviews = runtime.listThreadPreviews();
  const initialSelectedThreadId = getMostRecentlyActiveThreadId(initialThreadPreviews) ?? defaultThreadId;
  const initialThread = runtime.openThread(initialSelectedThreadId);

  return (
    <ConversationalAgentOsPageView
      initialSelectedThreadId={initialSelectedThreadId}
      initialThreadPreviews={initialThreadPreviews}
      initialThread={initialThread}
    />
  );
}
