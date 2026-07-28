"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createDispatchRegisterAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();

  const items = JSON.parse(String(formData.get("itemsJson") ?? "[]")) as Record<string, string>[];
  const signatoryIds = JSON.parse(String(formData.get("signatoryIdsJson") ?? "[]")) as string[];
  const issueDate = String(formData.get("issueDate") ?? "");
  const inspectorId = String(formData.get("inspectorId") ?? "") || null;

  await prisma.materialDispatchRegister.create({
    data: {
      spreadId: spread.id,
      voucherNumber: String(formData.get("voucherNumber")),
      issueDate: issueDate ? new Date(issueDate) : null,
      element: String(formData.get("element") ?? "") || null,
      inspectorId,
      vehicleNumber: String(formData.get("vehicleNumber") ?? "") || null,
      outboundConformance: String(formData.get("outboundConformance") ?? "") || null,
      stationFrom: String(formData.get("stationFrom") ?? "") || null,
      stationTo: String(formData.get("stationTo") ?? "") || null,
      remarks: String(formData.get("remarks") ?? "") || null,
      items: {
        create: items.map((it) => ({
          itemNumber: it.itemNumber,
          heatNo: it.heatNo || null,
          length: it.length ? Number(it.length) : null,
          wallThickness: it.wallThickness ? Number(it.wallThickness) : null,
          diameter: it.diameter ? Number(it.diameter) : null,
          remarks: it.remarks || null,
        })),
      },
      signatories: {
        create: signatoryIds.map((signatoryId) => ({ signatoryId })),
      },
    },
  });

  redirect("/materials/dispatch");
}
