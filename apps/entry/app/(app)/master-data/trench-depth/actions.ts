"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createTrenchDepthAction(formData: FormData) {
  await requireAdmin();
  const spread = await requireSpread();
  await prisma.trenchDepth.create({
    data: {
      spreadId: spread.id,
      stationFrom: Number(formData.get("stationFrom")),
      stationTo: Number(formData.get("stationTo")),
      requiredDepth: Number(formData.get("requiredDepth")),
    },
  });
  revalidatePath("/master-data/trench-depth");
}
