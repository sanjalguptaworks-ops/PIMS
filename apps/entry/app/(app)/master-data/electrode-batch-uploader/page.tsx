import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function ElectrodeBatchUploaderPage() {
  await requireAuth();
  return <PlaceholderPage title="Electrode Batch Uploader" />;
}
