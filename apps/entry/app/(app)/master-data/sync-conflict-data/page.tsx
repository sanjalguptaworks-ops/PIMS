import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function SyncConflictDataPage() {
  await requireAuth();
  return <PlaceholderPage title="Sync Conflict Data" />;
}
