"use server";

import { redirect } from "next/navigation";
import { prisma, type ActivityType } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { getActivityConfig } from "@/lib/activityConfig";

export async function createActivityRecordAction(slug: string, formData: FormData) {
  const session = await requireAuth();
  const spread = await requireSpread();
  const config = getActivityConfig(slug);
  if (!config) throw new Error(`Unknown activity: ${slug}`);

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

  const details: Record<string, string> = {};
  for (const f of config.detailFields) {
    const v = formData.get(`detail_${f.key}`);
    if (v) details[f.key] = String(v);
  }
  if (config.usesWeldRange) {
    const weldFrom = str("weldFrom");
    const weldTo = str("weldTo");
    if (weldFrom) details.weldFrom = weldFrom;
    if (weldTo) details.weldTo = weldTo;
  }

  const reportDate = str("reportDate");

  const record = await prisma.activityRecord.create({
    data: {
      spreadId: spread.id,
      activityType: config.activityType as ActivityType,
      reportNumber: str("reportNumber"),
      reportDate: reportDate ? new Date(reportDate) : null,
      weatherCondition: str("weatherCondition"),
      milePost: str("milePost"),
      rfiNumber: str("rfiNumber"),
      downStream: formData.get("downStream") === "on",
      stationFrom: config.usesStationRange ? num("stationFrom") : null,
      stationTo: config.usesStationRange ? num("stationTo") : null,
      sectionLength: config.usesStationRange ? num("sectionLength") : null,
      remarks: str("remarks"),
      details,
      createdById: session.userId,
    },
  });

  // Side effects that keep the Pipe Master inventory (and therefore the
  // reporting dashboard) in sync with field activity.
  if (config.activityType === "STRINGING" && details.itemNumber) {
    await prisma.pipe.updateMany({
      where: { spreadId: spread.id, pipeNo: details.itemNumber },
      data: {
        status: "STRUNG",
        stationChainage: num("stationFrom") ?? undefined,
      },
    });
  }

  if (config.activityType === "BENDING" && details.itemNumber) {
    await prisma.pipe.updateMany({
      where: { spreadId: spread.id, pipeNo: details.itemNumber },
      data: {
        bendDegree1: details.bendDegree1 ? Number(details.bendDegree1) : undefined,
        bendDegree2: details.bendDegree2 ? Number(details.bendDegree2) : undefined,
        bendTypeName1: details.bendType1 || undefined,
        bendTypeName2: details.bendType2 || undefined,
      },
    });
  }

  redirect(`/${config.zone}/${slug}?created=${record.id}`);
}
