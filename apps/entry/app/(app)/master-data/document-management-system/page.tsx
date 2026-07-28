import { requireAuth } from "@/lib/require-auth";
import PlaceholderPage from "@/components/PlaceholderPage";

export default async function DocumentManagementSystemPage() {
  await requireAuth();
  return <PlaceholderPage title="Document Management System" />;
}
