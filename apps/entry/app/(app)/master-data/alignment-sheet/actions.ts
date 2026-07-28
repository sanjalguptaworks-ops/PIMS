"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createAlignmentSheetAction(formData: FormData) {
  await requireAdmin();
  const spread = await requireSpread();
  await prisma.alignmentSheet.create({
    data: {
      spreadId: spread.id,
      sheetNo: String(formData.get("sheetNo")),
      description: String(formData.get("description") ?? "") || null,
    },
  });
  revalidatePath("/master-data/alignment-sheet");
}
