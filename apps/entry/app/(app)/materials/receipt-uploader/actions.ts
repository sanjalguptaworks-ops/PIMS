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

export async function uploadReceiptRegisterAction(_prev: UploadResult, formData: FormData): Promise<UploadResult> {
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
    const receiveDate = str(header["ReceiveDate"] ?? header["Receive Date"]);
    try {
      await prisma.materialReceiptRegister.create({
        data: {
          spreadId: spread.id,
          voucherNumber,
          receiveDate: receiveDate ? new Date(receiveDate) : null,
          element: str(header["Element"]),
          inspectorName: str(header["InspectorName"] ?? header["Inspector Name"]),
          vehicleNumber: str(header["VehicleNumber"] ?? header["Vehicle Number"]),
          inboundConformance: str(header["InboundConformance"]),
          stationFrom: str(header["StationFrom"] ?? header["Station From"]),
          stationTo: str(header["StationTo"] ?? header["Station To"]),
          itemCategory: str(header["ItemCategory"] ?? header["Item Category"]),
          items: {
            create: items.map((it) => ({
              itemNumber: str(it["ItemNumber"] ?? it["Item Number"]) ?? "",
              heatNo: str(it["HeatNo"] ?? it["Heat No"]),
              length: num(it["Length"]),
              wallThickness: num(it["WallThickness"] ?? it["Wall Thickness"]),
              diameter: num(it["Diameter"]),
              goodsReceiptNumber: str(it["GoodsReceiptNumber"] ?? it["Goods Receipt Number"]),
              receivedStatus: str(it["ReceivedStatus"] ?? it["Received Status"]),
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

  revalidatePath("/materials/receipt");
  return { inserted, skipped, errors: errors.slice(0, 20) };
}
