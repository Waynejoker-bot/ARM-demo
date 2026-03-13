import ConversationalAgentOsPage from "../conversational-agent-os/page";

export default function HomePage(_: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  return <ConversationalAgentOsPage />;
}
