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
    label: "Overview",
    items: [{ label: "Progress Dashboard", href: "/" }],
  },
  {
    label: "Reports",
    items: [
      { label: "Pipes", href: "/pipes" },
      { label: "Welds", href: "/welds" },
      { label: "NDT Defects", href: "/ndt" },
      { label: "Welder Performance", href: "/welders" },
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
                className="w-full flex items-center justify-between px-3 py-2 bg-emerald-50 text-emerald-900 font-medium text-left hover:bg-emerald-100"
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
                            active ? "bg-emerald-700/10 text-emerald-800 font-medium" : "text-slate-600"
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
