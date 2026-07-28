"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";

export async function createElectrodeAction(formData: FormData) {
  await requireAdmin();
  await prisma.electrode.create({
    data: {
      companyId: String(formData.get("companyId")),
      type: String(formData.get("type")),
      size: String(formData.get("size") ?? "") || null,
      classification: String(formData.get("classification") ?? "") || null,
    },
  });
  revalidatePath("/master-data/electrode");
}
