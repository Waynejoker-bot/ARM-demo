import { IntakeClient } from "@/components/intake/intake-client";
import { getMockDataset } from "@/lib/mock-selectors";

export default function IntakePage() {
  return <IntakeClient dataset={getMockDataset()} />;
}
