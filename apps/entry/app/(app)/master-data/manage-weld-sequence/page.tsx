import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function ManageWeldSequencePage() {
  await requireAuth();
  return <PlaceholderPage title="Manage Weld Sequence" />;
}
