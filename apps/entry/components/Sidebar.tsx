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
      { label: "WPS Weld Layer", href: "/master-data/wps-weld-layer" },
      { label: "Associate Weld Layer Company", href: "/master-data/associate-weld-layer-company" },
      { label: "Manage Welders", href: "/master-data/welders" },
      { label: "Welder Qualification", href: "/master-data/welder-qualification" },
      { label: "Coater Qualification", href: "/master-data/coater-qualification" },
      { label: "Splicer", href: "/master-data/splicer" },
      { label: "Electrode", href: "/master-data/electrode" },
      { label: "Electrode Batch Uploader", href: "/master-data/electrode-batch-uploader" },
      { label: "Vendor", href: "/master-data/vendor" },
      { label: "Purchase Order", href: "/master-data/purchase-order" },
      { label: "Pipe Master", href: "/master-data/pipes" },
      { label: "PTS Uploader", href: "/master-data/pts-uploader" },
      { label: "Alignment Sheet", href: "/master-data/alignment-sheet" },
      { label: "Line Wall Thickness", href: "/master-data/line-wall-thickness" },
      { label: "Line Crossing", href: "/master-data/line-crossing" },
      { label: "TP / IP", href: "/master-data/tp-ip" },
      { label: "Re-Routing", href: "/master-data/re-routing" },
      { label: "Trench Depth", href: "/master-data/trench-depth" },
      { label: "Hydrotest Section", href: "/master-data/hydrotest-section" },
      { label: "Manage Weld Sequence", href: "/master-data/manage-weld-sequence" },
      { label: "AFC Design Data", href: "/master-data/afc-design-data" },
      { label: "Item Update Uploader", href: "/master-data/item-update-uploader" },
      { label: "Document Management System", href: "/master-data/document-management-system" },
      { label: "Document Status", href: "/master-data/document-status" },
      { label: "Sync Conflict Data", href: "/master-data/sync-conflict-data" },
    ],
  },
  {
    label: "Materials",
    items: [
      { label: "Dispatch Issue Register", href: "/materials/dispatch" },
      { label: "Dispatch Register Uploader", href: "/materials/dispatch-uploader" },
      { label: "Receipt Register", href: "/materials/receipt" },
      { label: "Receipt Register Uploader", href: "/materials/receipt-uploader" },
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
    label: "Crossing",
    items: [
      { label: "HDD Crossing", href: "/crossing/hdd-crossing" },
      { label: "Crossing Detail", href: "/crossing/crossing-detail" },
    ],
  },
  {
    label: "Welding",
    items: [
      { label: "Welding", href: "/welding" },
      { label: "Cut Pipe", href: "/welding/cut-pipe" },
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
      { label: "Weld Repair", href: "/post-welding/weld-repair" },
      { label: "Joint Coating", href: "/post-welding/joint-coating" },
      { label: "Marker Installation", href: "/post-welding/marker-installation" },
      { label: "Lowering", href: "/post-welding/lowering" },
      { label: "OFC Splicing & Jointing", href: "/post-welding/ofc-splicing-jointing" },
      { label: "Backfilling", href: "/post-welding/backfilling" },
      { label: "HDPE Duct Laying", href: "/post-welding/hdpe-duct-laying" },
      { label: "Restoration", href: "/post-welding/restoration" },
      { label: "Pre-Hydrotest", href: "/post-welding/pre-hydrotest" },
      { label: "Temporary Cathodic Protection", href: "/post-welding/temporary-cathodic-protection" },
      { label: "Hydrostatic Test Report", href: "/post-welding/hydrotest-report" },
      { label: "Cleaning & Gauging", href: "/post-welding/cleaning-gauging" },
      { label: "Swabbing & Dewatering", href: "/post-welding/swabbing-dewatering" },
      { label: "Magnetic Cleaning", href: "/post-welding/magnetic-cleaning" },
      { label: "EGP", href: "/post-welding/egp" },
      { label: "OFC Blowing", href: "/post-welding/ofc-blowing" },
      { label: "OFC Joint Pits", href: "/post-welding/ofc-joint-pits" },
      { label: "Nitrogen Purging", href: "/post-welding/nitrogen-purging" },
    ],
  },
  {
    label: "CMS Activity Uploader",
    items: [
      { label: "CMS Activity Uploader", href: "/cms/cms-activity-uploader" },
      { label: "QC Activity Uploader", href: "/cms/qc-activity-uploader" },
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
