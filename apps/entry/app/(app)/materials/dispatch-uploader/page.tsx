import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import DispatchUploadForm from "./UploadForm";

export default async function DispatchUploaderPage() {
  await requireAuth();
  const spread = await requireSpread();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Dispatch Register Uploader</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>
      <div className="card">
        <DispatchUploadForm />
      </div>
    </div>
  );
}
