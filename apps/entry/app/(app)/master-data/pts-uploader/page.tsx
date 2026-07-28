import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function PtsUploaderPage() {
  await requireAuth();
  return <PlaceholderPage title="PTS Uploader" />;
}
