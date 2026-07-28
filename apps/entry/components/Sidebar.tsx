"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    label: "Master Data",
    items: [
      { label: "Manage WPS", href: "/master-data/wps" },
      { label: "Manage Welders", href: "/master-data/welders" },
      { label: "Pipe Master", href: "/master-data/pipes" },
    ],
  },
  {
    label: "Materials",
    items: [
      { label: "Dispatch Issue Register", href: "/materials/dispatch" },
      { label: "Receipt Register", href: "/materials/receipt" },
      { label: "Material Damage Inspection", href: "/materials/damage-inspection" },
      { label: "Material Return Register", href: "/materials/return" },
    ],
  },
  {
    label: "Pre Welding",
    items: [
      { label: "Route Survey", href: "/pre-welding/route-survey" },
      { label: "ROW Handover", href: "/pre-welding/row" },
      { label: "Clearing and Grading", href: "/pre-welding/clearing-grading" },
      { label: "Trenching", href: "/pre-welding/trenching" },
      { label: "Stringing", href: "/pre-welding/stringing" },
      { label: "Bending", href: "/pre-welding/bending" },
      { label: "As Built Survey", href: "/pre-welding/as-built-survey" },
    ],
  },
  {
    label: "Welding",
    items: [{ label: "Welding", href: "/welding" }],
  },
  {
    label: "NDT",
    items: [
      { label: "X Ray", href: "/ndt/xray" },
      { label: "Weld MUT", href: "/ndt/weld-mut" },
      { label: "Weld LPT", href: "/ndt/weld-lpt" },
      { label: "Pipe MUT", href: "/ndt/pipe-mut" },
      { label: "Pipe LPT", href: "/ndt/pipe-lpt" },
    ],
  },
  {
    label: "Post Welding",
    items: [
      { label: "Joint Coating", href: "/post-welding/joint-coating" },
      { label: "Lowering", href: "/post-welding/lowering" },
      { label: "Backfilling", href: "/post-welding/backfilling" },
      { label: "Hydrostatic Test Report", href: "/post-welding/hydrotest-report" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(GROUPS.map((g) => [g.label, true]))
  );

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white self-start sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="text-center font-semibold text-slate-700 py-3 border-b border-slate-200 bg-slate-50">
        Site Map
      </div>
      <nav className="text-sm">
        {GROUPS.map((group) => {
          const isOpen = openGroups[group.label];
          return (
            <div key={group.label} className="border-b border-slate-100">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 bg-sky-50 text-sky-900 font-medium text-left hover:bg-sky-100"
              >
                <span>{group.label}</span>
                <span className="text-xs">{isOpen ? "▾" : "▸"}</span>
              </button>
              {isOpen && (
                <ul>
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          prefetch={false}
                          className={`block px-4 py-1.5 border-t border-slate-50 hover:bg-slate-50 ${
                            active ? "bg-brand/10 text-brand font-medium" : "text-slate-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
