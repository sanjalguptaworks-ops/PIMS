import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/(app)/actions";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/pipes", label: "Pipes" },
  { href: "/welds", label: "Welds" },
  { href: "/ndt", label: "NDT Defects" },
  { href: "/welders", label: "Welder Performance" },
];

export default async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1 flex items-center justify-between">
        <nav className="flex gap-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        {session && (
          <div className="flex items-center gap-4">
            <span>
              {session.name} ({session.role.replace("_", " ")})
            </span>
            <form action={logoutAction}>
              <button type="submit" className="hover:text-white">
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
          P
        </div>
        <span className="font-bold text-lg">PIMS</span>
        <span className="text-xs text-slate-400 ml-1">Reporting</span>
      </div>
    </header>
  );
}
