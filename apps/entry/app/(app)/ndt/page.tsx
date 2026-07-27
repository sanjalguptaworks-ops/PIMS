import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { NDT_CONFIGS } from "@/lib/ndtConfig";

export default async function NdtPage() {
  await requireAuth();
  const spread = await requireSpread();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-lg font-semibold mb-1">NDT Zone</h1>
      <p className="text-sm text-slate-500 mb-4">{spread.lineLoop.name} / {spread.name}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NDT_CONFIGS.map((c) => (
          <Link key={c.slug} href={`/ndt/${c.slug}`} prefetch={false} className="card p-4 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-brand mb-1">{c.title}</h2>
            <p className="text-sm text-slate-500">Weld result, quadrant coverage and defect logging.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
