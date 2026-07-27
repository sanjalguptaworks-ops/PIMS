import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { activitiesForZone } from "@/lib/activityConfig";

export default async function PreWeldingPage() {
  await requireAuth();
  const spread = await requireSpread();
  const activities = activitiesForZone("pre-welding");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-lg font-semibold mb-1">Pre-Welding Zone</h1>
      <p className="text-sm text-slate-500 mb-4">{spread.lineLoop.name} / {spread.name}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((a) => (
          <Link key={a.slug} href={`/pre-welding/${a.slug}`} prefetch={false} className="card p-4 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-brand mb-1">{a.title}</h2>
            <p className="text-sm text-slate-500">{a.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
