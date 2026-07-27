"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";

export async function createWeldAction(formData: FormData) {
  const session = await requireAuth();
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

  const upstreamItemNumber = str("upstreamItemNumber");
  const downstreamItemNumber = str("downstreamItemNumber");

  const [upstreamPipe, downstreamPipe] = await Promise.all([
    upstreamItemNumber ? prisma.pipe.findUnique({ where: { spreadId_pipeNo: { spreadId: spread.id, pipeNo: upstreamItemNumber } } }) : null,
    downstreamItemNumber ? prisma.pipe.findUnique({ where: { spreadId_pipeNo: { spreadId: spread.id, pipeNo: downstreamItemNumber } } }) : null,
  ]);

  const welderIds = formData.getAll("welderIds").map(String).filter(Boolean);
  const electrodeBatchId = str("electrodeBatchId");
  const wpsId = str("wpsId");
  const reportDate = str("reportDate");

  const weld = await prisma.weld.create({
    data: {
      spreadId: spread.id,
      jointNumber: String(formData.get("jointNumber")),
      wpsId: wpsId || null,
      upstreamPipeId: upstreamPipe?.id ?? null,
      downstreamPipeId: downstreamPipe?.id ?? null,
      weldType: str("weldType"),
      weldVersion: str("weldVersion"),
      weldPosition: str("weldPosition"),
      weldDirection: str("weldDirection"),
      reRoutingRef: str("reRouting"),
      visualCheck: (str("visualCheck") as "OK" | "NOT_OK" | null) ?? null,
      productionWeld: formData.get("productionWeld") === "Yes",
      coordX: num("coordX"),
      coordY: num("coordY"),
      coordZ: num("coordZ"),
      preHeating: str("preHeating"),
      interpassTemp: str("interpassTemp"),
      gaugingDone: str("gaugingDone") === "Done",
      swabbingDone: str("swabbingDone") === "Done",
      backweldDone: str("backweldDone") === "Done",
      backweldLocation: str("backweldLocation"),
      backweldLength: num("backweldLength"),
      tentativeChainage: num("chainageTo"),
      routingSectionLength: num("stationFrom"),
      reportNumber: str("reportNumber"),
      reportDate: reportDate ? new Date(reportDate) : null,
      milePost: str("milePost"),
      weatherCondition: str("weatherCondition"),
      remarks: str("remarks"),
      isWeldingEntered: true,
      activityCount: 1,
      createdById: session.userId,
      welders: { create: welderIds.map((welderId) => ({ welderId })) },
      electrodes: electrodeBatchId ? { create: [{ electrodeBatchId }] } : undefined,
    },
  });

  await prisma.pipe.updateMany({
    where: { id: { in: [upstreamPipe?.id, downstreamPipe?.id].filter(Boolean) as string[] } },
    data: { status: "WELDED" },
  });

  redirect(`/welding?created=${weld.id}`);
}
