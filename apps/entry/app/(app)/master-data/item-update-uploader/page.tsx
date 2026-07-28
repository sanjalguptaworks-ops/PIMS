import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function ItemUpdateUploaderPage() {
  await requireAuth();
  return <PlaceholderPage title="Item Update Uploader" />;
}
