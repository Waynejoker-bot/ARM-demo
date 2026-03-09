import { createMockDataset } from "@/lib/mocks";

const dataset = createMockDataset();

export function getMockDataset() {
  return dataset;
}

export function getDealById(dealId: string) {
  return dataset.deals.find((deal) => deal.id === dealId) ?? null;
}

export function getMeetingById(meetingId: string) {
  return dataset.meetings.find((meeting) => meeting.id === meetingId) ?? null;
}

export function getAccountById(accountId: string) {
  return dataset.accounts.find((account) => account.id === accountId) ?? null;
}

export function getAccountThreadById(accountId: string) {
  return dataset.accountThreads.find((thread) => thread.accountId === accountId) ?? null;
}

export function getAccountThreadsForRep(repId: string) {
  return dataset.accountThreads.filter((thread) => thread.ownerRepId === repId);
}

export function getRepById(repId: string) {
  return dataset.repScorecards.find((rep) => rep.repId === repId) ?? null;
}

export function getRepReportByRepId(repId: string) {
  return dataset.repReportSnapshots.find((snapshot) => snapshot.repId === repId) ?? null;
}

export function getRepReportSnapshots() {
  return dataset.repReportSnapshots;
}

export function getDealsForAccount(accountId: string) {
  return dataset.deals.filter((deal) => deal.accountId === accountId);
}

export function getMeetingsForDeal(dealId: string) {
  return dataset.meetings.filter((meeting) => meeting.dealId === dealId);
}

export function getAgentOutputsForObject(objectType: string, objectId: string) {
  return dataset.agentOutputs.filter(
    (output) => output.objectType === objectType && output.objectId === objectId
  );
}

export function getEvidenceForIds(evidenceIds: string[]) {
  return dataset.evidenceRefs.filter((evidence) => evidenceIds.includes(evidence.id));
}
