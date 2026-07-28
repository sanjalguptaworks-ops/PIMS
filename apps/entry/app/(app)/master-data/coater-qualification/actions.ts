"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

export async function createCoaterQualificationAction(formData: FormData) {
  await requireAuth();
  const qualifiedDate = String(formData.get("qualifiedDate") ?? "") || null;
  const expiryDate = String(formData.get("expiryDate") ?? "") || null;
  await prisma.coaterQualification.create({
    data: {
      companyId: String(formData.get("companyId")),
      name: String(formData.get("name")),
      qualifiedDate: qualifiedDate ? new Date(qualifiedDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });
  revalidatePath("/master-data/coater-qualification");
}
