"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";

export async function createSignatoryAction(formData: FormData) {
  await requireAdmin();
  await prisma.signatory.create({
    data: {
      companyId: String(formData.get("companyId")),
      name: String(formData.get("name")),
      designation: String(formData.get("designation") ?? "") || null,
    },
  });
  revalidatePath("/master-data/signatory");
}
