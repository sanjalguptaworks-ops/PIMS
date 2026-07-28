"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";

export async function createVendorAction(formData: FormData) {
  await requireAdmin();
  await prisma.vendor.create({
    data: {
      name: String(formData.get("name")),
      code: String(formData.get("code") ?? "") || null,
    },
  });
  revalidatePath("/master-data/vendor");
}
