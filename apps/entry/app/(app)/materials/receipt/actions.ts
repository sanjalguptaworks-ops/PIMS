"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createReceiptRegisterAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();

  const items = JSON.parse(String(formData.get("itemsJson") ?? "[]")) as Record<string, string>[];
  const receiveDate = String(formData.get("receiveDate") ?? "");

  await prisma.materialReceiptRegister.create({
    data: {
      spreadId: spread.id,
      voucherNumber: String(formData.get("voucherNumber")),
      receiveDate: receiveDate ? new Date(receiveDate) : null,
      element: String(formData.get("element") ?? "") || null,
      inspectorName: String(formData.get("inspectorName") ?? "") || null,
      vehicleNumber: String(formData.get("vehicleNumber") ?? "") || null,
      inboundConformance: String(formData.get("inboundConformance") ?? "") || null,
      stationFrom: String(formData.get("stationFrom") ?? "") || null,
      stationTo: String(formData.get("stationTo") ?? "") || null,
      itemCategory: String(formData.get("itemCategory") ?? "") || null,
      remarks: String(formData.get("remarks") ?? "") || null,
      items: {
        create: items.map((it) => ({
          itemNumber: it.itemNumber,
          heatNo: it.heatNo || null,
          length: it.length ? Number(it.length) : null,
          wallThickness: it.wallThickness ? Number(it.wallThickness) : null,
          diameter: it.diameter ? Number(it.diameter) : null,
          goodsReceiptNumber: it.goodsReceiptNumber || null,
          receivedStatus: it.receivedStatus || null,
          damageType: it.damageType || null,
          damageSize: it.damageSize || null,
          locationNumber: it.locationNumber || null,
          damagedBy: it.damagedBy || null,
          detailRemarks: it.detailRemarks || null,
        })),
      },
    },
  });

  redirect("/materials/receipt");
}
