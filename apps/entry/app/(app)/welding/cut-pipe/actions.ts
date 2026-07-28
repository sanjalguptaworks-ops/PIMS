"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createCutItemAction(formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();

  const childItems = JSON.parse(String(formData.get("childItemsJson") ?? "[]")) as Record<string, string>[];
  const reportDate = String(formData.get("reportDate") ?? "");
  const parentItemLength = String(formData.get("parentItemLength") ?? "");
  const diameter = String(formData.get("diameter") ?? "");
  const wallThickness = String(formData.get("wallThickness") ?? "");

  await prisma.cutItem.create({
    data: {
      spreadId: spread.id,
      parentPipeId: String(formData.get("parentPipeId")),
      parentItemLength: parentItemLength ? Number(parentItemLength) : null,
      diameter: diameter ? Number(diameter) : null,
      wallThickness: wallThickness ? Number(wallThickness) : null,
      heatNo: String(formData.get("heatNo") ?? "") || null,
      reportNumber: String(formData.get("reportNumber") ?? "") || null,
      reportDate: reportDate ? new Date(reportDate) : null,
      remarks: String(formData.get("remarks") ?? "") || null,
      childItems: {
        create: childItems.map((c) => ({
          childItemNumber: c.childItemNumber,
          displayChildItemNumber: c.childItemNumber,
          length: c.length ? Number(c.length) : null,
          originalBevel: c.originalBevel === "No" ? false : true,
          isBend: c.isBend === "Yes",
          isScrap: c.isScrap === "Yes",
        })),
      },
    },
  });

  redirect("/welding/cut-pipe");
}
