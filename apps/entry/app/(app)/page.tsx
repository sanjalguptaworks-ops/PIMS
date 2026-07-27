import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";
import { getSelectedSpread } from "@/lib/spread";

const ZONES = [
  {
    href: "/master-data",
    title: "Master Data",
    description: "WPS, welders, inspectors, electrodes, alignment sheets and the pipe master inventory.",
  },
  {
    href: "/materials",
    title: "Material Zone",
    description: "Shipment, packing, issue & receipt details between points of origin and consumption.",
  },
  {
    href: "/pre-welding",
    title: "Pre-Welding Zone",
    description: "Route Survey, ROW, Clearing & Grading, Trenching, Stringing and Bending activities.",
  },
  {
    href: "/welding",
    title: "Welding Zone",
    description: "Weld creation, welder/electrode traceability and weld QC.",
  },
  {
    href: "/ndt",
    title: "NDT Zone",
    description: "X-Ray, Weld MUT, Weld LPT, Pipe MUT and Pipe LPT results and defects.",
  },
  {
    href: "/post-welding",
    title: "Post-Welding Zone",
    description: "Joint coating, lowering, backfilling, tie-ins and hydrotest.",
  },
];

export default async function DashboardPage() {
  await requireAuth();
  const spread = await getSelectedSpread();

  return (
    <div className="max-w-6xl mx-auto">
      {!spread && (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 text-amber-800 text-sm px-4 py-3 flex items-center justify-between">
          <span>No Line Loop / Spread selected. Choose one to start entering data.</span>
          <Link href="/select-spread" className="btn-primary">
            Select
          </Link>
        </div>
      )}

      <h1 className="text-lg font-semibold mb-4">Site Zones</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ZONES.map((z) => (
          <Link key={z.href} href={z.href} prefetch={false} className="card p-4 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-brand mb-1">{z.title}</h2>
            <p className="text-sm text-slate-500">{z.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
