"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireAdmin } from "@/lib/require-auth";

export async function createWelderAction(formData: FormData) {
  await requireAdmin();
  await prisma.welder.create({
    data: {
      companyId: String(formData.get("companyId")),
      welderCode: String(formData.get("welderCode")),
      name: String(formData.get("name")),
      stampNo: String(formData.get("stampNo") ?? "") || null,
    },
  });
  revalidatePath("/master-data/welders");
}

export async function createInspectorAction(formData: FormData) {
  await requireAdmin();
  await prisma.inspector.create({
    data: {
      companyId: String(formData.get("companyId")),
      name: String(formData.get("name")),
      certificationNo: String(formData.get("certificationNo") ?? "") || null,
    },
  });
  revalidatePath("/master-data/welders");
}
