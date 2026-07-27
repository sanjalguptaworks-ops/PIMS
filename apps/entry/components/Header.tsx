import Link from "next/link";
import { getSession } from "@/lib/session";
import { getSelectedSpread } from "@/lib/spread";
import { logoutAction } from "@/app/(app)/actions";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/master-data", label: "Master Data" },
  { href: "/materials", label: "Materials" },
  { href: "/pre-welding", label: "Pre-Welding" },
  { href: "/welding", label: "Welding" },
  { href: "/ndt", label: "NDT" },
  { href: "/post-welding", label: "Post-Welding" },
];

export default async function Header() {
  const session = await getSession();
  const spread = await getSelectedSpread();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
        <nav className="flex gap-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/select-spread" prefetch={false} className="hover:text-white">
            {spread ? `${spread.lineLoop.name} / ${spread.name}` : "No Line Loop/Spread Selected"}
          </Link>
          {session && (
            <>
              <span>
                {session.name} ({session.role.replace("_", " ")})
              </span>
              <form action={logoutAction}>
                <button type="submit" className="hover:text-white">
                  Logout
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <Link href="/" prefetch={false} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand text-white flex items-center justify-center font-bold text-sm">
            P
          </div>
          <span className="font-bold text-lg">PIMS</span>
          <span className="text-xs text-slate-400 ml-1">Data Entry</span>
        </Link>
        {spread?.lineLoop.project && (
          <span className="text-sm font-medium text-slate-600">{spread.lineLoop.project.name}</span>
        )}
      </div>
    </header>
  );
}
