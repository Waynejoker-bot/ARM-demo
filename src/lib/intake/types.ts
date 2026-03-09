import { z } from "zod";

export const intakeQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  reason: z.string().min(1),
});

export const intakeCandidateSchema = z.object({
  entityType: z.enum(["account", "deal", "meeting", "contact"]),
  entityId: z.string().min(1),
  label: z.string().min(1),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(1),
});

export const intakeProposalSchema = z.object({
  targetType: z.enum([
    "meeting_summary",
    "conversation",
    "evidence_ref",
    "deal_note",
    "next_step",
  ]),
  targetObjectId: z.string().nullable(),
  title: z.string().min(1),
  summary: z.string().min(1),
  confidence: z.number().min(0).max(1),
  requiresManualReview: z.boolean(),
});

export const intakeClassificationInputSchema = z.object({
  sourceKind: z.enum(["recording", "text", "email", "link"]),
  rawText: z.string().min(1),
  repId: z.string().min(1),
  fileName: z.string().optional(),
  externalUrl: z.string().url().optional(),
});

export const intakeClassificationResponseSchema = z.object({
  title: z.string().min(1),
  normalizedSourceKind: z.enum(["recording", "text", "email", "link"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().min(1),
  needsManualInput: z.boolean(),
  missingFields: z.array(z.string()),
  candidates: z.array(intakeCandidateSchema),
  questions: z.array(intakeQuestionSchema),
  proposals: z.array(intakeProposalSchema),
});

export type IntakeClassificationInput = z.infer<typeof intakeClassificationInputSchema>;
export type IntakeClassificationResponse = z.infer<typeof intakeClassificationResponseSchema>;
