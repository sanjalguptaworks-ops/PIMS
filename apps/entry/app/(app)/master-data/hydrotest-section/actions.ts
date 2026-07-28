"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createHydrotestSectionAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();
  const stationFrom = String(formData.get("stationFrom") ?? "");
  const stationTo = String(formData.get("stationTo") ?? "");
  const testPressure = String(formData.get("testPressure") ?? "");
  await prisma.hydrotestSection.create({
    data: {
      spreadId: spread.id,
      sectionNo: String(formData.get("sectionNo")),
      stationFrom: stationFrom ? Number(stationFrom) : null,
      stationTo: stationTo ? Number(stationTo) : null,
      testPressure: testPressure ? Number(testPressure) : null,
    },
  });
  revalidatePath("/master-data/hydrotest-section");
}
