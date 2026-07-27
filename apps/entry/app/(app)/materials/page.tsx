import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

const LINKS = [
  { href: "/materials/dispatch", title: "Dispatch Issue Register", description: "Material issued from store to site (or vice versa)." },
  { href: "/materials/receipt", title: "Receipt Register", description: "Material received, with acceptance and damage checks." },
  { href: "/materials/damage-inspection", title: "Material Damage Inspection", description: "Detailed damage inspection report for a receiving location." },
  { href: "/materials/return", title: "Material Return Register", description: "Material returned to store." },
];

export default async function MaterialsPage() {
  await requireAuth();
  const spread = await requireSpread();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-lg font-semibold mb-1">Material Zone</h1>
      <p className="text-sm text-slate-500 mb-4">{spread.lineLoop.name} / {spread.name}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} prefetch={false} className="card p-4 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-brand mb-1">{l.title}</h2>
            <p className="text-sm text-slate-500">{l.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
