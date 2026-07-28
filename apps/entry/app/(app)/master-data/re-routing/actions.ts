"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createReRoutingAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();
  const stationFrom = String(formData.get("stationFrom") ?? "");
  const stationTo = String(formData.get("stationTo") ?? "");
  await prisma.reRouting.create({
    data: {
      spreadId: spread.id,
      description: String(formData.get("description") ?? "") || null,
      stationFrom: stationFrom ? Number(stationFrom) : null,
      stationTo: stationTo ? Number(stationTo) : null,
    },
  });
  revalidatePath("/master-data/re-routing");
}
