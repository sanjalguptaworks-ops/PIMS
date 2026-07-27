"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createReturnRegisterAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();

  const items = JSON.parse(String(formData.get("itemsJson") ?? "[]")) as Record<string, string>[];
  const returnDate = String(formData.get("returnDate") ?? "");

  await prisma.materialReturnRegister.create({
    data: {
      spreadId: spread.id,
      voucherNumber: String(formData.get("voucherNumber")),
      returnDate: returnDate ? new Date(returnDate) : null,
      element: String(formData.get("element") ?? "") || null,
      inspectorName: String(formData.get("inspectorName") ?? "") || null,
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
    },
  });

  redirect("/materials/return");
}
