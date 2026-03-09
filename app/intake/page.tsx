import { IntakeWorkspace } from "@/components/intake/intake-workspace";
import { getMockDataset } from "@/lib/mock-selectors";

export default function IntakePage() {
  return <IntakeWorkspace dataset={getMockDataset()} />;
}
