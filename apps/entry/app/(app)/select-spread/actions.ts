"use server";

import { setSelectedSpreadId } from "@/lib/spread";

export type SelectSpreadState = { ok: boolean };

export async function selectSpreadAction(_prev: SelectSpreadState, formData: FormData): Promise<SelectSpreadState> {
  const spreadId = String(formData.get("spreadId") ?? "");
  if (!spreadId) return { ok: false };
  await setSelectedSpreadId(spreadId);
  return { ok: true };
}
