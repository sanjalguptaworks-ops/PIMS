"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

export async function createWpsWeldLayerAction(formData: FormData) {
  await requireAuth();
  await prisma.wPSWeldLayer.create({
    data: {
      wpsId: String(formData.get("wpsId")),
      layerNumber: Number(formData.get("layerNumber")),
      layerName: String(formData.get("layerName") ?? "") || null,
      weldingProcess: String(formData.get("weldingProcess") ?? "") || null,
      fillerMetalClass: String(formData.get("fillerMetalClass") ?? "") || null,
      fillerMetalDiameter: String(formData.get("fillerMetalDiameter") ?? "") || null,
      currentType: String(formData.get("currentType") ?? "") || null,
      travelSpeed: String(formData.get("travelSpeed") ?? "") || null,
      remarks: String(formData.get("remarks") ?? "") || null,
    },
  });
  revalidatePath("/master-data/wps-weld-layer");
}
