"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createLineCrossingAction(formData: FormData) {
  await requireAdmin();
  const spread = await requireSpread();
  const stationFrom = String(formData.get("stationFrom") ?? "");
  const stationTo = String(formData.get("stationTo") ?? "");
  await prisma.lineCrossing.create({
    data: {
      spreadId: spread.id,
      crossingNo: String(formData.get("crossingNo")),
      type: String(formData.get("type") ?? "") || null,
      stationFrom: stationFrom ? Number(stationFrom) : null,
      stationTo: stationTo ? Number(stationTo) : null,
    },
  });
  revalidatePath("/master-data/line-crossing");
}
