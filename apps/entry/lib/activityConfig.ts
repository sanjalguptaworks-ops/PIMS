import type { ActivityType } from "@pims/db";

export interface DetailField {
  key: string;
  label: string;
  type?: "text" | "number" | "select";
  options?: string[];
}

export interface ActivityConfig {
  slug: string;
  activityType: ActivityType;
  title: string;
  description: string;
  zone: "pre-welding" | "post-welding";
  usesStationRange: boolean;
  usesWeldRange: boolean;
  detailFields: DetailField[];
}

export const ACTIVITY_CONFIGS: ActivityConfig[] = [
  {
    slug: "route-survey",
    activityType: "ROUTE_SURVEY",
    title: "Route Survey",
    description: "Route Survey, ROW, Trenching, Stringing and Bending activities are tracked here.",
    zone: "pre-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "alignmentSheetNumber", label: "Alignment Sheet Number" },
      { key: "typeOfTerrain", label: "Type of Terrain" },
      { key: "typeOfSoil", label: "Type of Soil" },
      { key: "reRouting", label: "Re Routing" },
    ],
  },
  {
    slug: "row",
    activityType: "ROW_HANDOVER",
    title: "ROW Handover",
    description: "Right of way handover with coordinate capture.",
    zone: "pre-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "alignmentSheetNumber", label: "Alignment Sheet Number" },
      { key: "typeOfTerrain", label: "Type of Terrain" },
      { key: "typeOfSoil", label: "Type of Soil" },
      { key: "reRouting", label: "Re Routing" },
      { key: "coordNorth", label: "Coordinate North", type: "number" },
      { key: "coordEast", label: "Coordinate East", type: "number" },
    ],
  },
  {
    slug: "clearing-grading",
    activityType: "CLEARING_GRADING",
    title: "Clearing & Grading",
    description: "Clearing and grading of the right of way.",
    zone: "pre-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "alignmentSheetNumber", label: "Alignment Sheet Number" },
      { key: "typeOfTerrain", label: "Type of Terrain" },
      { key: "typeOfSoil", label: "Type of Soil" },
      { key: "reRouting", label: "Re Routing" },
    ],
  },
  {
    slug: "trenching",
    activityType: "TRENCHING",
    title: "Trenching",
    description: "Trench excavation along the route.",
    zone: "pre-welding",
    usesStationRange: true,
    usesWeldRange: true,
    detailFields: [
      { key: "alignmentSheetNumber", label: "Alignment Sheet Number" },
      { key: "depth", label: "Depth", type: "number" },
      { key: "trenchWidth", label: "Trench Width", type: "number" },
      { key: "bottomWidth", label: "Bottom Width", type: "number" },
      { key: "rockyGroundTrench", label: "Rocky Ground Trench", type: "select", options: ["Yes", "No"] },
      { key: "typeOfGround", label: "Type of Ground" },
    ],
  },
  {
    slug: "stringing",
    activityType: "STRINGING",
    title: "Stringing",
    description: "Placing a physical pipe joint at its route location. Marks the pipe as Strung.",
    zone: "pre-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "itemNumber", label: "Item Number (Pipe No)" },
      { key: "heatNo", label: "Heat No" },
      { key: "length", label: "Length", type: "number" },
      { key: "wallThickness", label: "Wall Thickness", type: "number" },
      { key: "diameter", label: "Diameter", type: "number" },
      { key: "coatingNo", label: "Coating No" },
      { key: "alignmentSheetNumber", label: "Alignment Sheet Number" },
      { key: "crossingNo", label: "Crossing No" },
      { key: "coatingDamage", label: "Coating Damage", type: "select", options: ["None", "Minor", "Major"] },
    ],
  },
  {
    slug: "bending",
    activityType: "BENDING",
    title: "Pipe Cold Bending",
    description: "Cold bending of a pipe joint, with QC checks.",
    zone: "pre-welding",
    usesStationRange: false,
    usesWeldRange: false,
    detailFields: [
      { key: "itemNumber", label: "Item Number (Pipe No)" },
      { key: "chainage", label: "Chainage", type: "number" },
      { key: "bendType1", label: "Bend Type 1" },
      { key: "bendDegree1", label: "Bend Degree 1", type: "number" },
      { key: "bendType2", label: "Bend Type 2" },
      { key: "bendDegree2", label: "Bend Degree 2", type: "number" },
      { key: "bendDirection", label: "Bend Direction" },
      { key: "visualInspection", label: "Visual Inspection (Internal & External)", type: "select", options: ["Yes", "No"] },
      { key: "internalCalibration", label: "Internal Calibration", type: "select", options: ["Accepted", "Not Accepted"] },
      { key: "externalCalibration", label: "External Calibration", type: "select", options: ["Accepted", "Not Accepted"] },
      { key: "gaugePlate", label: "Gauge Plate", type: "select", options: ["Accepted", "Not Accepted"] },
      { key: "holidayTest", label: "Holiday Test", type: "select", options: ["Yes", "No"] },
    ],
  },
  {
    slug: "as-built-survey",
    activityType: "AS_BUILT_SURVEY",
    title: "As-Built Survey",
    description: "Final surveyed as-built geometry per weld span.",
    zone: "pre-welding",
    usesStationRange: true,
    usesWeldRange: true,
    detailFields: [
      { key: "zoneNumber", label: "Zone Number" },
      { key: "coordX", label: "Coordinate From X", type: "number" },
      { key: "coordY", label: "Coordinate From Y", type: "number" },
      { key: "groundElevation", label: "Ground Elevation", type: "number" },
      { key: "pipeTopElevation", label: "Pipe Top Elevation", type: "number" },
      { key: "coverDepth", label: "Cover Depth", type: "number" },
      { key: "surveyCode", label: "Survey Code" },
      { key: "wallThickness", label: "WT (mm)", type: "number" },
    ],
  },
  // --- Post-Welding zone ---
  {
    slug: "joint-coating",
    activityType: "JOINT_COATING",
    title: "Joint Coating",
    description: "Field joint coating applied over a completed weld.",
    zone: "post-welding",
    usesStationRange: false,
    usesWeldRange: true,
    detailFields: [
      { key: "coatingType", label: "Coating Type" },
      { key: "coatingMaterialBatch", label: "Coating Material Batch No" },
      { key: "holidayTest", label: "Holiday Test", type: "select", options: ["Pass", "Fail"] },
      { key: "thickness", label: "Coating Thickness (mm)", type: "number" },
    ],
  },
  {
    slug: "lowering",
    activityType: "LOWERING",
    title: "Lowering",
    description: "Lowering the strung/coated pipe section into the trench.",
    zone: "post-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "coatingConditionCheck", label: "Coating Condition Check", type: "select", options: ["OK", "Not OK"] },
      { key: "paddingUsed", label: "Padding Used", type: "select", options: ["Yes", "No"] },
    ],
  },
  {
    slug: "backfilling",
    activityType: "BACKFILLING",
    title: "Backfilling",
    description: "Backfilling the trench after lowering.",
    zone: "post-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "backfillMaterial", label: "Backfill Material" },
      { key: "compactionCheck", label: "Compaction Check", type: "select", options: ["OK", "Not OK"] },
    ],
  },
  {
    slug: "hydrotest-report",
    activityType: "HYDROTEST_REPORT",
    title: "Hydrostatic Test Report",
    description: "Hydrotest results for a completed hydrotest section.",
    zone: "post-welding",
    usesStationRange: true,
    usesWeldRange: false,
    detailFields: [
      { key: "testSectionNo", label: "Test Section No" },
      { key: "testPressure", label: "Test Pressure", type: "number" },
      { key: "holdDurationHours", label: "Hold Duration (hrs)", type: "number" },
      { key: "result", label: "Result", type: "select", options: ["Pass", "Fail"] },
    ],
  },
];

export function getActivityConfig(slug: string) {
  return ACTIVITY_CONFIGS.find((c) => c.slug === slug);
}

export function activitiesForZone(zone: ActivityConfig["zone"]) {
  return ACTIVITY_CONFIGS.filter((c) => c.zone === zone);
}
