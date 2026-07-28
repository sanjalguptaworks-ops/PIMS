import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function AfcDesignDataPage() {
  await requireAuth();
  return <PlaceholderPage title="AFC Design Data" />;
}
