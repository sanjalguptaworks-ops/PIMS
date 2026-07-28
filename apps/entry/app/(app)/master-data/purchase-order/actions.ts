"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";

export async function createPurchaseOrderAction(formData: FormData) {
  await requireAdmin();
  await prisma.purchaseOrder.create({
    data: {
      vendorId: String(formData.get("vendorId")),
      poNumber: String(formData.get("poNumber")),
    },
  });
  revalidatePath("/master-data/purchase-order");
}
