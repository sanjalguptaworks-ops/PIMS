"use server";

import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export type UploadResult = { inserted: number; skipped: number; errors: string[] };

const num = (v: unknown): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};
const str = (v: unknown): string | null => {
  if (v === undefined || v === null || v === "") return null;
  return String(v).trim();
};

export async function uploadDispatchRegisterAction(_prev: UploadResult, formData: FormData): Promise<UploadResult> {
  await requireAuth();
  const spread = await requireSpread();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { inserted: 0, skipped: 0, errors: ["No file selected."] };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const inspectors = await prisma.inspector.findMany();
  const inspectorIdByName = new Map(inspectors.map((i) => [i.name.toLowerCase(), i.id]));

  const errors: string[] = [];
  const byVoucher = new Map<string, { header: Record<string, unknown>; items: Record<string, unknown>[] }>();

  rows.forEach((row, idx) => {
    const voucherNumber = str(row["VoucherNumber"] ?? row["Voucher Number"]);
    if (!voucherNumber) {
      errors.push(`Row ${idx + 2}: missing VoucherNumber, skipped.`);
      return;
    }
    if (!byVoucher.has(voucherNumber)) {
      byVoucher.set(voucherNumber, { header: row, items: [] });
    }
    byVoucher.get(voucherNumber)!.items.push(row);
  });

  let inserted = 0;
  let skipped = 0;
  for (const [voucherNumber, { header, items }] of byVoucher) {
    const issueDate = str(header["IssueDate"] ?? header["Issue Date"]);
    const inspectorName = str(header["InspectorName"] ?? header["Inspector Name"]);
    const inspectorId = inspectorName ? inspectorIdByName.get(inspectorName.toLowerCase()) ?? null : null;
    if (inspectorName && !inspectorId) {
      errors.push(`Voucher ${voucherNumber}: inspector "${inspectorName}" not found in Manage Welders, left blank.`);
    }
    try {
      await prisma.materialDispatchRegister.create({
        data: {
          spreadId: spread.id,
          voucherNumber,
          issueDate: issueDate ? new Date(issueDate) : null,
          element: str(header["Element"]),
          inspectorId,
          vehicleNumber: str(header["VehicleNumber"] ?? header["Vehicle Number"]),
          outboundConformance: str(header["OutboundConformance"]),
          stationFrom: str(header["StationFrom"] ?? header["Station From"]),
          stationTo: str(header["StationTo"] ?? header["Station To"]),
          items: {
            create: items.map((it) => ({
              itemNumber: str(it["ItemNumber"] ?? it["Item Number"]) ?? "",
              heatNo: str(it["HeatNo"] ?? it["Heat No"]),
              length: num(it["Length"]),
              wallThickness: num(it["WallThickness"] ?? it["Wall Thickness"]),
              diameter: num(it["Diameter"]),
              remarks: str(it["Remarks"]),
            })),
          },
        },
      });
      inserted++;
    } catch {
      errors.push(`Voucher ${voucherNumber}: already exists, skipped.`);
      skipped++;
    }
  }

  revalidatePath("/materials/dispatch");
  return { inserted, skipped, errors: errors.slice(0, 20) };
}
