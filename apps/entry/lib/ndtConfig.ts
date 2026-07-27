import type { NDTMethod } from "@pims/db";

export interface NdtConfig {
  slug: string;
  method: NDTMethod;
  title: string;
}

export const NDT_CONFIGS: NdtConfig[] = [
  { slug: "xray", method: "XRAY", title: "X Ray" },
  { slug: "weld-mut", method: "WELD_MUT", title: "Weld MUT" },
  { slug: "weld-lpt", method: "WELD_LPT", title: "Weld LPT" },
  { slug: "pipe-mut", method: "PIPE_MUT", title: "Pipe MUT" },
  { slug: "pipe-lpt", method: "PIPE_LPT", title: "Pipe LPT" },
];

export function getNdtConfig(slug: string) {
  return NDT_CONFIGS.find((c) => c.slug === slug);
}

/** The four clock-position quadrants every NDT method inspects on a girth weld. */
export const NDT_QUADRANTS = [
  { srNo: 1, degreeFrom: 0, degreeTo: 90 },
  { srNo: 2, degreeFrom: 90, degreeTo: 180 },
  { srNo: 3, degreeFrom: 180, degreeTo: 270 },
  { srNo: 4, degreeFrom: 270, degreeTo: 360 },
];
