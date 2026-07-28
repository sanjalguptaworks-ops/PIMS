"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

export async function createSplicerAction(formData: FormData) {
  await requireAuth();
  await prisma.splicer.create({
    data: {
      companyId: String(formData.get("companyId")),
      name: String(formData.get("name")),
    },
  });
  revalidatePath("/master-data/splicer");
}
