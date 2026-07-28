"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pims/db";
import { requireSpread } from "@/lib/spread";
import { requireAdmin } from "@/lib/require-auth";

export async function createWpsAction(formData: FormData) {
  await requireAdmin();
  const spread = await requireSpread();

  const num = (name: string) => {
    const v = formData.get(name);
    if (!v || v === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };
  const str = (name: string) => {
    const v = formData.get(name);
    return v ? String(v) : null;
  };

  await prisma.wPS.create({
    data: {
      spreadId: spread.id,
      companyId: String(formData.get("companyId")),
      wpsNo: String(formData.get("wpsNo")),
      weldingProgression: str("weldingProgression"),
      weldingProcess: str("weldingProcess"),
      jointVersionGroup: str("jointVersionGroup"),
      jointTypeGroup: str("jointTypeGroup"),
      diameterFrom: num("diameterFrom"),
      diameterTo: num("diameterTo"),
      wallThicknessFrom: num("wallThicknessFrom"),
      wallThicknessTo: num("wallThicknessTo"),
      materialGradeFrom: str("materialGradeFrom"),
      materialGradeTo: str("materialGradeTo"),
      pipeVendorFrom: str("pipeVendorFrom"),
      pipeVendorTo: str("pipeVendorTo"),
      steelMillVendorFrom: str("steelMillVendorFrom"),
      steelMillVendorTo: str("steelMillVendorTo"),
      noOfWelders: num("noOfWelders") ? Math.trunc(num("noOfWelders")!) : null,
    },
  });

  revalidatePath("/master-data/wps");
}
