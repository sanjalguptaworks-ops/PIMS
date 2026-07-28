"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createTPIPAction(formData: FormData) {
  await requireAdmin();
  const spread = await requireSpread();
  await prisma.tPIP.create({
    data: {
      spreadId: spread.id,
      tpNo: String(formData.get("tpNo") ?? "") || null,
      ipNo: String(formData.get("ipNo") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
    },
  });
  revalidatePath("/master-data/tp-ip");
}
