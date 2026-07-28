import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function AssociateWeldLayerCompanyPage() {
  await requireAuth();
  return <PlaceholderPage title="Associate Weld Layer Company" />;
}
