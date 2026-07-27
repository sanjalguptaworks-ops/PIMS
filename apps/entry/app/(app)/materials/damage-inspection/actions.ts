"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createDamageInspectionAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();

  const items = JSON.parse(String(formData.get("itemsJson") ?? "[]")) as Record<string, string>[];
  const issueDate = String(formData.get("issueDate") ?? "");

  await prisma.materialDamageInspection.create({
    data: {
      spreadId: spread.id,
      receivingLocation: String(formData.get("receivingLocation") ?? "") || null,
      materialReportNo: String(formData.get("materialReportNo") ?? "") || null,
      issueDate: issueDate ? new Date(issueDate) : null,
      inspectorName: String(formData.get("inspectorName") ?? "") || null,
      items: {
        create: items.map((it) => ({
          itemNumber: it.itemNumber,
          heatNo: it.heatNo || null,
          length: it.length ? Number(it.length) : null,
          wallThickness: it.wallThickness ? Number(it.wallThickness) : null,
          diameter: it.diameter ? Number(it.diameter) : null,
          coatingVisual: it.coatingVisual === "Yes",
          bevelStatus: it.bevelStatus === "Yes",
          receivedStatus: it.receivedStatus || null,
          damagedBy: it.damagedBy || null,
          remarks: it.remarks || null,
        })),
      },
    },
  });

  redirect("/materials/damage-inspection");
}
