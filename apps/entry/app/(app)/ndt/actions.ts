"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { getNdtConfig, NDT_QUADRANTS } from "@/lib/ndtConfig";

export async function createNdtResultAction(slug: string, formData: FormData) {
  await requireAuth();
  const spread = await requireSpread();
  const config = getNdtConfig(slug);
  if (!config) throw new Error(`Unknown NDT method: ${slug}`);

  const str = (name: string) => {
    const v = formData.get(name);
    return v ? String(v) : null;
  };
  const num = (v: string | undefined) => {
    if (!v) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  const jointNumber = String(formData.get("weldNumber") ?? "");
  const resolvedWeld = await prisma.weld.findFirst({ where: { spreadId: spread.id, jointNumber } });

  if (!resolvedWeld) {
    throw new Error(`Weld ${jointNumber} not found in this spread.`);
  }

  const defects = JSON.parse(String(formData.get("defectsJson") ?? "[]")) as Record<string, string>[];
  const reportDate = str("reportDate");

  const ndtResult = await prisma.nDTResult.create({
    data: {
      weldId: resolvedWeld.id,
      method: config.method,
      reportNumber: str("reportNumber"),
      reportDate: reportDate ? new Date(reportDate) : null,
      overallResult: (str("overallResult") as "ACCEPT" | "NOT_ACCEPT" | null) ?? null,
      locationTaken: str("locationTaken"),
      locationResult: str("locationResult"),
      quadrants: {
        create: NDT_QUADRANTS.map((q) => ({
          srNo: q.srNo,
          degreeFrom: q.degreeFrom,
          degreeTo: q.degreeTo,
          jointSectionFrom: resolvedWeld.routingSectionLength
            ? (resolvedWeld.routingSectionLength * (q.degreeFrom / 360))
            : null,
          jointSectionTo: resolvedWeld.routingSectionLength
            ? (resolvedWeld.routingSectionLength * (q.degreeTo / 360))
            : null,
        })),
      },
      defects: {
        create: defects.map((d) => ({
          defLocationFrom: num(d.defLocationFrom),
          defLocationTo: num(d.defLocationTo),
          defectLength: num(d.defectLength),
          result: d.result || null,
          defectType: d.defectType || null,
          defectWelderId: d.defectWelderId || null,
          depth: num(d.depth),
          defectLayer: d.defectLayer || null,
          defectHeight: num(d.defectHeight),
          remarks: d.remarks || null,
        })),
      },
    },
  });

  await prisma.weld.update({
    where: { id: resolvedWeld.id },
    data: { activityCount: { increment: 1 } },
  });

  redirect(`/ndt/${slug}?created=${ndtResult.id}`);
}
