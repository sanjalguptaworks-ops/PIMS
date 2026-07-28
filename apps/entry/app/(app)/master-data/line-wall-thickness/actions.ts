"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createLineWallThicknessAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();
  await prisma.lineWallThickness.create({
    data: {
      spreadId: spread.id,
      stationFrom: Number(formData.get("stationFrom")),
      stationTo: Number(formData.get("stationTo")),
      wallThickness: Number(formData.get("wallThickness")),
    },
  });
  revalidatePath("/master-data/line-wall-thickness");
}
