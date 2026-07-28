"use server";

import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";
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

export async function uploadPtsSheetAction(_prev: UploadResult, formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const spread = await requireSpread();

  const vendorId = str(formData.get("vendorId"));
  const purchaseOrderId = str(formData.get("purchaseOrderId"));
  const itemCategory = str(formData.get("itemCategory"));
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { inserted: 0, skipped: 0, errors: ["No file selected."] };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const errors: string[] = [];
  const data = rows
    .map((row, idx) => {
      const pipeNo = str(row["Item No."] ?? row["Item No"]);
      if (!pipeNo) {
        errors.push(`Row ${idx + 2}: missing Item No., skipped.`);
        return null;
      }
      return {
        spreadId: spread.id,
        pipeNo,
        displayPipeNo: pipeNo,
        heatNo: str(row["Heat No."] ?? row["Heat No"]),
        length: num(row["Length[m]"] ?? row["Length"]),
        diameter: num(row["Nominal Diameter[inch]"] ?? row["Nominal Diameter"]),
        wallThickness: num(row["Nominal Wall Thickness[mm]"] ?? row["Nominal Wall Thickness"]),
        coatingNo: str(row["External Coating No."] ?? row["External Coating No"]),
        coilNo: str(row["Plate/Coil No."] ?? row["Plate/Coil No"]),
        vendorId,
        purchaseOrderId,
        itemCategory,
        ptsDetails: {
          aslNo: str(row["ASL No"]),
          internalCoatingNo: str(row["Internal Coating No."]),
          externalCoatingDate: str(row["External Coating Date"]),
          internalCoatingDate: str(row["Internal Coating Date"]),
          steelGrade: str(row["Steel Grade"]),
          weightTonnes: str(row["Weight[Tonnes]"]),
          sheetVendor: str(row["Vendor"]),
          hotBendRadius: str(row["Hot Bend Radius[m]"]),
          hotBendAngle: str(row["Hot Bend Angle[deg]"]),
          codeOfManufacture: str(row["Code of Manufacture"]),
          externalCoatingType: str(row["External Coating Type"]),
          shipmentInvoiceNo: str(row["Shipment Invoice No."]),
          shipmentDate: str(row["Shipment Date[DD/MM/YYYY]"]),
          shipmentPackingListNo: str(row["Shipment Packing List No"]),
          packingListDate: str(row["Packing List Date[DD/MM/YYYY]"]),
          contractLineItemNo: str(row["Contract Line Item No."]),
          soLineItem: str(row["S.O. Line Item"]),
          transportationType: str(row["Transportation Type"]),
          inspectionReleaseCertificateNo: str(row["Inspection Release Certificate No."]),
          itemCode: str(row["Item Code"]),
          itemType: str(row["Item Type"]),
        },
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  let inserted = 0;
  for (const item of data) {
    try {
      await prisma.pipe.create({ data: item });
      inserted++;
    } catch {
      errors.push(`Item No. ${item.pipeNo}: already exists in this spread, skipped.`);
    }
  }

  revalidatePath("/master-data/pts-uploader");
  revalidatePath("/master-data/pipes");
  return { inserted, skipped: data.length - inserted, errors: errors.slice(0, 20) };
}
