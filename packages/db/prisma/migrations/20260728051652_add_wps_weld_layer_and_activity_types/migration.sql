-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'CROSSING_DETAIL';
ALTER TYPE "ActivityType" ADD VALUE 'CMS_ACTIVITY_UPLOAD';
ALTER TYPE "ActivityType" ADD VALUE 'QC_ACTIVITY_UPLOAD';

-- CreateTable
CREATE TABLE "WPSWeldLayer" (
    "id" TEXT NOT NULL,
    "wpsId" TEXT NOT NULL,
    "layerNumber" INTEGER NOT NULL,
    "layerName" TEXT,
    "weldingProcess" TEXT,
    "fillerMetalClass" TEXT,
    "fillerMetalDiameter" TEXT,
    "currentType" TEXT,
    "travelSpeed" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WPSWeldLayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WPSWeldLayer_wpsId_layerNumber_key" ON "WPSWeldLayer"("wpsId", "layerNumber");

-- AddForeignKey
ALTER TABLE "WPSWeldLayer" ADD CONSTRAINT "WPSWeldLayer_wpsId_fkey" FOREIGN KEY ("wpsId") REFERENCES "WPS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
