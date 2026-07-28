"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";

export async function createWelderQualificationAction(formData: FormData) {
  await requireAdmin();
  const wpsId = String(formData.get("wpsId") ?? "") || null;
  const qualifiedDate = String(formData.get("qualifiedDate") ?? "") || null;
  const expiryDate = String(formData.get("expiryDate") ?? "") || null;
  await prisma.welderQualification.create({
    data: {
      welderId: String(formData.get("welderId")),
      wpsId,
      qualifiedDate: qualifiedDate ? new Date(qualifiedDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      result: String(formData.get("result") ?? "") || null,
    },
  });
  revalidatePath("/master-data/welder-qualification");
}
