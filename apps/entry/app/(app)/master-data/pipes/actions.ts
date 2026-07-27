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

export async function uploadPipesAction(_prev: UploadResult, formData: FormData): Promise<UploadResult> {
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
  const data = rows
    .map((row, idx) => {
      const pipeNo = str(row["PipeNo"] ?? row["Pipe No"] ?? row["pipeNo"]);
      if (!pipeNo) {
        errors.push(`Row ${idx + 2}: missing PipeNo, skipped.`);
        return null;
      }
      return {
        spreadId: spread.id,
        pipeNo,
        displayPipeNo: str(row["DisplayPipeNo"] ?? row["Display Pipe No"]) ?? pipeNo,
        heatNo: str(row["HeatNo"] ?? row["Heat No"]),
        length: num(row["Length"]),
        diameter: num(row["Diameter"]),
        wallThickness: num(row["WallThickness"] ?? row["Wall Thickness"]),
        coatingNo: str(row["CoatingNo"] ?? row["Coating No"]),
        bendDegree1: num(row["BendDegree1"]),
        bendDegree2: num(row["BendDegree2"]),
        bendTypeName1: str(row["BendTypeName1"]),
        bendTypeName2: str(row["BendTypeName2"]),
        coilNo: str(row["CoilNo"] ?? row["Coil No"]),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  let inserted = 0;
  const chunkSize = 1000;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const result = await prisma.pipe.createMany({ data: chunk, skipDuplicates: true });
    inserted += result.count;
  }

  revalidatePath("/master-data/pipes");
  return { inserted, skipped: data.length - inserted, errors: errors.slice(0, 20) };
}

export async function createPipeAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();

  await prisma.pipe.create({
    data: {
      spreadId: spread.id,
      pipeNo: String(formData.get("pipeNo")),
      displayPipeNo: str(formData.get("displayPipeNo")) ?? String(formData.get("pipeNo")),
      heatNo: str(formData.get("heatNo")),
      length: num(formData.get("length")),
      diameter: num(formData.get("diameter")),
      wallThickness: num(formData.get("wallThickness")),
      coatingNo: str(formData.get("coatingNo")),
      coilNo: str(formData.get("coilNo")),
    },
  });

  revalidatePath("/master-data/pipes");
}
