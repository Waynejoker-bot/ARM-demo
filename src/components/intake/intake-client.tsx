"use client";

import { useState, useTransition } from "react";

import type { MockDataset } from "@/lib/domain/types";
import type { IntakeClassificationResponse } from "@/lib/intake/types";
import { IntakeWorkspace } from "@/components/intake/intake-workspace";

export function IntakeClient({ dataset }: { dataset: MockDataset }) {
  const focusItem =
    dataset.intakeItems.find((item) => item.status === "ready_to_apply") ?? dataset.intakeItems[0];
  const [sourceKind, setSourceKind] = useState<
    "recording" | "text" | "email" | "link"
  >(focusItem.sourceKind);
  const [draftText, setDraftText] = useState(focusItem.rawTextPreview);
  const [recognition, setRecognition] = useState<IntakeClassificationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClassify() {
    setErrorMessage(null);

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/intake/classify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceKind,
            rawText: draftText,
            repId: focusItem.submittedByRepId,
            fileName: focusItem.fileName ?? undefined,
            externalUrl: focusItem.externalUrl ?? undefined,
          }),
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message ?? "素材识别失败。");
        }

        setRecognition(payload);
      })().catch((error) => {
        setRecognition(null);
        setErrorMessage(error instanceof Error ? error.message : "素材识别失败。");
      });
    });
  }

  return (
    <IntakeWorkspace
      dataset={dataset}
      sourceKind={sourceKind}
      draftText={draftText}
      onDraftTextChange={setDraftText}
      onSourceKindChange={setSourceKind}
      onClassify={handleClassify}
      isSubmitting={isPending}
      errorMessage={errorMessage}
      recognitionOverride={recognition}
    />
  );
}
