import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function DocumentStatusPage() {
  await requireAuth();
  return <PlaceholderPage title="Document Status" />;
}
