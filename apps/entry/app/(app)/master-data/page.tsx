import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

const LINKS = [
  { href: "/master-data/wps", title: "Manage WPS", description: "Welding Procedure Specifications, bulk upload via Excel." },
  { href: "/master-data/welders", title: "Manage Welders", description: "Welders, welder qualifications and inspectors." },
  { href: "/master-data/pipes", title: "Pipe Master", description: "Bulk-upload and browse the pipe joint inventory." },
];

export default async function MasterDataPage() {
  await requireAuth();
  const spread = await requireSpread();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-lg font-semibold mb-1">Master Data</h1>
      <p className="text-sm text-slate-500 mb-4">{spread.lineLoop.name} / {spread.name}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
