-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('CLIENT', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'CONTRACTOR_ADMIN', 'ENTRY_USER', 'REPORTING_USER');

-- CreateEnum
CREATE TYPE "PipeStatus" AS ENUM ('IN_STOCK', 'STRUNG', 'WELDED', 'CUT', 'SCRAPPED');

-- CreateEnum
CREATE TYPE "VisualCheckResult" AS ENUM ('OK', 'NOT_OK');

-- CreateEnum
CREATE TYPE "NDTMethod" AS ENUM ('XRAY', 'WELD_MUT', 'WELD_LPT', 'PIPE_MUT', 'PIPE_LPT');

-- CreateEnum
CREATE TYPE "NDTOverallResult" AS ENUM ('ACCEPT', 'NOT_ACCEPT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ROUTE_SURVEY', 'ROW_HANDOVER', 'CLEARING_GRADING', 'TRENCHING', 'STRINGING', 'BENDING', 'AS_BUILT_SURVEY', 'WELD_REPAIR', 'JOINT_COATING', 'MARKER_INSTALLATION', 'LOWERING', 'OFC_SPLICING_JOINTING', 'BACKFILLING', 'HDPE_DUCT_LAYING', 'RESTORATION', 'PRE_HYDROTEST', 'TEMPORARY_CATHODIC_PROTECTION', 'HYDROTEST_REPORT', 'CLEANING_GAUGING', 'SWABBING_DEWATERING', 'MAGNETIC_CLEANING', 'EGP', 'OFC_BLOWING', 'OFC_JOINT_PITS', 'NITROGEN_PURGING', 'HDD_CROSSING');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientCompanyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineLoop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LineLoop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spread" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lineLoopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "companyId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WPS" (
    "id" TEXT NOT NULL,
    "wpsNo" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "weldingProgression" TEXT,
    "weldingProcess" TEXT,
    "jointVersionGroup" TEXT,
    "jointTypeGroup" TEXT,
    "diameterFrom" DOUBLE PRECISION,
    "diameterTo" DOUBLE PRECISION,
    "wallThicknessFrom" DOUBLE PRECISION,
    "wallThicknessTo" DOUBLE PRECISION,
    "materialGradeFrom" TEXT,
    "materialGradeTo" TEXT,
    "pipeVendorFrom" TEXT,
    "pipeVendorTo" TEXT,
    "steelMillVendorFrom" TEXT,
    "steelMillVendorTo" TEXT,
    "noOfWelders" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WPS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welder" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "welderCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stampNo" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Welder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelderQualification" (
    "id" TEXT NOT NULL,
    "welderId" TEXT NOT NULL,
    "wpsId" TEXT,
    "qualifiedDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WelderQualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspector" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "certificationNo" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Inspector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoaterQualification" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qualifiedDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "CoaterQualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Splicer" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Splicer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Electrode" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT,
    "classification" TEXT,

    CONSTRAINT "Electrode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectrodeBatch" (
    "id" TEXT NOT NULL,
    "electrodeId" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "heatNo" TEXT,
    "receivedDate" TIMESTAMP(3),
    "qtyReceived" DOUBLE PRECISION,
    "qtyConsumed" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ElectrodeBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlignmentSheet" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "sheetNo" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AlignmentSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineWallThickness" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "stationFrom" DOUBLE PRECISION NOT NULL,
    "stationTo" DOUBLE PRECISION NOT NULL,
    "wallThickness" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LineWallThickness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineCrossing" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "crossingNo" TEXT NOT NULL,
    "type" TEXT,
    "stationFrom" DOUBLE PRECISION,
    "stationTo" DOUBLE PRECISION,

    CONSTRAINT "LineCrossing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TPIP" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "tpNo" TEXT,
    "ipNo" TEXT,
    "description" TEXT,

    CONSTRAINT "TPIP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReRouting" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "description" TEXT,
    "stationFrom" DOUBLE PRECISION,
    "stationTo" DOUBLE PRECISION,

    CONSTRAINT "ReRouting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrenchDepth" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "stationFrom" DOUBLE PRECISION NOT NULL,
    "stationTo" DOUBLE PRECISION NOT NULL,
    "requiredDepth" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TrenchDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HydrotestSection" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "sectionNo" TEXT NOT NULL,
    "stationFrom" DOUBLE PRECISION,
    "stationTo" DOUBLE PRECISION,
    "testPressure" DOUBLE PRECISION,

    CONSTRAINT "HydrotestSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipe" (
    "id" TEXT NOT NULL,
    "pipeNo" TEXT NOT NULL,
    "displayPipeNo" TEXT,
    "parentPipeId" TEXT,
    "spreadId" TEXT NOT NULL,
    "heatNo" TEXT,
    "length" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "wallThickness" DOUBLE PRECISION,
    "coatingNo" TEXT,
    "bendDegree1" DOUBLE PRECISION,
    "bendDegree2" DOUBLE PRECISION,
    "bendTypeName1" TEXT,
    "bendTypeName2" TEXT,
    "coilNo" TEXT,
    "isScrap" BOOLEAN NOT NULL DEFAULT false,
    "status" "PipeStatus" NOT NULL DEFAULT 'IN_STOCK',
    "stationChainage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutItem" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "parentPipeId" TEXT NOT NULL,
    "parentItemLength" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "wallThickness" DOUBLE PRECISION,
    "heatNo" TEXT,
    "reportNumber" TEXT,
    "reportDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CutItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildItem" (
    "id" TEXT NOT NULL,
    "cutItemId" TEXT NOT NULL,
    "childItemNumber" TEXT NOT NULL,
    "displayChildItemNumber" TEXT,
    "length" DOUBLE PRECISION,
    "originalBevel" BOOLEAN NOT NULL DEFAULT true,
    "isBend" BOOLEAN NOT NULL DEFAULT false,
    "isScrap" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChildItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weld" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "jointNumber" TEXT NOT NULL,
    "jointSuffix" TEXT,
    "compositeJointNo" TEXT,
    "displayCompositeJointNo" TEXT,
    "routingSectionLength" DOUBLE PRECISION,
    "sequenceNumber" INTEGER,
    "tentativeChainage" DOUBLE PRECISION,
    "weldSequenceNo" TEXT,
    "activityCount" INTEGER NOT NULL DEFAULT 0,
    "isWeldingEntered" BOOLEAN NOT NULL DEFAULT false,
    "upstreamPipeId" TEXT,
    "downstreamPipeId" TEXT,
    "wpsId" TEXT,
    "weldType" TEXT,
    "weldVersion" TEXT,
    "weldPosition" TEXT,
    "weldDirection" TEXT,
    "reRoutingRef" TEXT,
    "visualCheck" "VisualCheckResult",
    "productionWeld" BOOLEAN NOT NULL DEFAULT true,
    "coordX" DOUBLE PRECISION,
    "coordY" DOUBLE PRECISION,
    "coordZ" DOUBLE PRECISION,
    "preHeating" TEXT,
    "interpassTemp" TEXT,
    "gaugingDone" BOOLEAN,
    "swabbingDone" BOOLEAN,
    "backweldDone" BOOLEAN,
    "backweldLocation" TEXT,
    "backweldLength" DOUBLE PRECISION,
    "reportNumber" TEXT,
    "reportDate" TIMESTAMP(3),
    "milePost" TEXT,
    "weatherCondition" TEXT,
    "remarks" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeldWelder" (
    "id" TEXT NOT NULL,
    "weldId" TEXT NOT NULL,
    "welderId" TEXT NOT NULL,

    CONSTRAINT "WeldWelder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeldElectrode" (
    "id" TEXT NOT NULL,
    "weldId" TEXT NOT NULL,
    "electrodeBatchId" TEXT NOT NULL,

    CONSTRAINT "WeldElectrode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NDTResult" (
    "id" TEXT NOT NULL,
    "weldId" TEXT NOT NULL,
    "method" "NDTMethod" NOT NULL,
    "reportNumber" TEXT,
    "reportDate" TIMESTAMP(3),
    "overallResult" "NDTOverallResult",
    "locationTaken" TEXT,
    "locationResult" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NDTResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NDTQuadrant" (
    "id" TEXT NOT NULL,
    "ndtResultId" TEXT NOT NULL,
    "srNo" INTEGER NOT NULL,
    "degreeFrom" DOUBLE PRECISION NOT NULL,
    "degreeTo" DOUBLE PRECISION NOT NULL,
    "jointSectionFrom" DOUBLE PRECISION,
    "jointSectionTo" DOUBLE PRECISION,
    "locationResult" TEXT,

    CONSTRAINT "NDTQuadrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NDTDefect" (
    "id" TEXT NOT NULL,
    "ndtResultId" TEXT NOT NULL,
    "defLocationFrom" DOUBLE PRECISION,
    "defLocationTo" DOUBLE PRECISION,
    "defectLength" DOUBLE PRECISION,
    "result" TEXT,
    "defectType" TEXT,
    "defectWelderId" TEXT,
    "depth" DOUBLE PRECISION,
    "defectLayer" TEXT,
    "defectHeight" DOUBLE PRECISION,
    "remarks" TEXT,

    CONSTRAINT "NDTDefect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialDispatchRegister" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "element" TEXT,
    "inspectorName" TEXT,
    "vehicleNumber" TEXT,
    "outboundConformance" TEXT,
    "stationFrom" TEXT,
    "stationTo" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialDispatchRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialDispatchItem" (
    "id" TEXT NOT NULL,
    "registerId" TEXT NOT NULL,
    "itemNumber" TEXT NOT NULL,
    "heatNo" TEXT,
    "length" DOUBLE PRECISION,
    "wallThickness" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "remarks" TEXT,

    CONSTRAINT "MaterialDispatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialReceiptRegister" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "receiveDate" TIMESTAMP(3),
    "element" TEXT,
    "inspectorName" TEXT,
    "vehicleNumber" TEXT,
    "inboundConformance" TEXT,
    "stationFrom" TEXT,
    "stationTo" TEXT,
    "itemCategory" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialReceiptRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialReceiptItem" (
    "id" TEXT NOT NULL,
    "registerId" TEXT NOT NULL,
    "itemNumber" TEXT NOT NULL,
    "heatNo" TEXT,
    "length" DOUBLE PRECISION,
    "wallThickness" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "goodsReceiptNumber" TEXT,
    "receivedStatus" TEXT,
    "damageType" TEXT,
    "damageSize" TEXT,
    "locationNumber" TEXT,
    "damagedBy" TEXT,
    "detailRemarks" TEXT,

    CONSTRAINT "MaterialReceiptItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialDamageInspection" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "receivingLocation" TEXT,
    "materialReportNo" TEXT,
    "issueDate" TIMESTAMP(3),
    "inspectorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialDamageInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialDamageInspectionItem" (
    "id" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "itemNumber" TEXT NOT NULL,
    "heatNo" TEXT,
    "length" DOUBLE PRECISION,
    "wallThickness" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "coatingVisual" BOOLEAN,
    "bevelStatus" BOOLEAN,
    "receivedStatus" TEXT,
    "damagedBy" TEXT,
    "remarks" TEXT,

    CONSTRAINT "MaterialDamageInspectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialReturnRegister" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "returnDate" TIMESTAMP(3),
    "element" TEXT,
    "inspectorName" TEXT,
    "vehicleNumber" TEXT,
    "outboundConformance" TEXT,
    "stationFrom" TEXT,
    "stationTo" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialReturnRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialReturnItem" (
    "id" TEXT NOT NULL,
    "registerId" TEXT NOT NULL,
    "itemNumber" TEXT NOT NULL,
    "heatNo" TEXT,
    "length" DOUBLE PRECISION,
    "wallThickness" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "remarks" TEXT,

    CONSTRAINT "MaterialReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRecord" (
    "id" TEXT NOT NULL,
    "spreadId" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "reportNumber" TEXT,
    "reportDate" TIMESTAMP(3),
    "pageNumber" INTEGER NOT NULL DEFAULT 1,
    "weatherCondition" TEXT,
    "milePost" TEXT,
    "downStream" BOOLEAN NOT NULL DEFAULT false,
    "rfiNumber" TEXT,
    "stationFrom" DOUBLE PRECISION,
    "stationTo" DOUBLE PRECISION,
    "sectionLength" DOUBLE PRECISION,
    "remarks" TEXT,
    "details" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityFile" (
    "id" TEXT NOT NULL,
    "activityRecordId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineLoop_projectId_name_key" ON "LineLoop"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Spread_lineLoopId_name_key" ON "Spread"("lineLoopId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_userId_projectId_key" ON "ProjectMember"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "WPS_spreadId_wpsNo_key" ON "WPS"("spreadId", "wpsNo");

-- CreateIndex
CREATE UNIQUE INDEX "Welder_companyId_welderCode_key" ON "Welder"("companyId", "welderCode");

-- CreateIndex
CREATE UNIQUE INDEX "AlignmentSheet_spreadId_sheetNo_key" ON "AlignmentSheet"("spreadId", "sheetNo");

-- CreateIndex
CREATE UNIQUE INDEX "Pipe_spreadId_pipeNo_key" ON "Pipe"("spreadId", "pipeNo");

-- CreateIndex
CREATE UNIQUE INDEX "Weld_spreadId_jointNumber_jointSuffix_key" ON "Weld"("spreadId", "jointNumber", "jointSuffix");

-- CreateIndex
CREATE UNIQUE INDEX "WeldWelder_weldId_welderId_key" ON "WeldWelder"("weldId", "welderId");

-- CreateIndex
CREATE UNIQUE INDEX "WeldElectrode_weldId_electrodeBatchId_key" ON "WeldElectrode"("weldId", "electrodeBatchId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialDispatchRegister_spreadId_voucherNumber_key" ON "MaterialDispatchRegister"("spreadId", "voucherNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialReceiptRegister_spreadId_voucherNumber_key" ON "MaterialReceiptRegister"("spreadId", "voucherNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialReturnRegister_spreadId_voucherNumber_key" ON "MaterialReturnRegister"("spreadId", "voucherNumber");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientCompanyId_fkey" FOREIGN KEY ("clientCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineLoop" ADD CONSTRAINT "LineLoop_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spread" ADD CONSTRAINT "Spread_lineLoopId_fkey" FOREIGN KEY ("lineLoopId") REFERENCES "LineLoop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WPS" ADD CONSTRAINT "WPS_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WPS" ADD CONSTRAINT "WPS_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welder" ADD CONSTRAINT "Welder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelderQualification" ADD CONSTRAINT "WelderQualification_welderId_fkey" FOREIGN KEY ("welderId") REFERENCES "Welder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelderQualification" ADD CONSTRAINT "WelderQualification_wpsId_fkey" FOREIGN KEY ("wpsId") REFERENCES "WPS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspector" ADD CONSTRAINT "Inspector_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoaterQualification" ADD CONSTRAINT "CoaterQualification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Splicer" ADD CONSTRAINT "Splicer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electrode" ADD CONSTRAINT "Electrode_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectrodeBatch" ADD CONSTRAINT "ElectrodeBatch_electrodeId_fkey" FOREIGN KEY ("electrodeId") REFERENCES "Electrode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlignmentSheet" ADD CONSTRAINT "AlignmentSheet_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineWallThickness" ADD CONSTRAINT "LineWallThickness_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineCrossing" ADD CONSTRAINT "LineCrossing_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TPIP" ADD CONSTRAINT "TPIP_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReRouting" ADD CONSTRAINT "ReRouting_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrenchDepth" ADD CONSTRAINT "TrenchDepth_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HydrotestSection" ADD CONSTRAINT "HydrotestSection_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipe" ADD CONSTRAINT "Pipe_parentPipeId_fkey" FOREIGN KEY ("parentPipeId") REFERENCES "Pipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipe" ADD CONSTRAINT "Pipe_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutItem" ADD CONSTRAINT "CutItem_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutItem" ADD CONSTRAINT "CutItem_parentPipeId_fkey" FOREIGN KEY ("parentPipeId") REFERENCES "Pipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildItem" ADD CONSTRAINT "ChildItem_cutItemId_fkey" FOREIGN KEY ("cutItemId") REFERENCES "CutItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weld" ADD CONSTRAINT "Weld_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weld" ADD CONSTRAINT "Weld_upstreamPipeId_fkey" FOREIGN KEY ("upstreamPipeId") REFERENCES "Pipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weld" ADD CONSTRAINT "Weld_downstreamPipeId_fkey" FOREIGN KEY ("downstreamPipeId") REFERENCES "Pipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weld" ADD CONSTRAINT "Weld_wpsId_fkey" FOREIGN KEY ("wpsId") REFERENCES "WPS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeldWelder" ADD CONSTRAINT "WeldWelder_weldId_fkey" FOREIGN KEY ("weldId") REFERENCES "Weld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeldWelder" ADD CONSTRAINT "WeldWelder_welderId_fkey" FOREIGN KEY ("welderId") REFERENCES "Welder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeldElectrode" ADD CONSTRAINT "WeldElectrode_weldId_fkey" FOREIGN KEY ("weldId") REFERENCES "Weld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeldElectrode" ADD CONSTRAINT "WeldElectrode_electrodeBatchId_fkey" FOREIGN KEY ("electrodeBatchId") REFERENCES "ElectrodeBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NDTResult" ADD CONSTRAINT "NDTResult_weldId_fkey" FOREIGN KEY ("weldId") REFERENCES "Weld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NDTQuadrant" ADD CONSTRAINT "NDTQuadrant_ndtResultId_fkey" FOREIGN KEY ("ndtResultId") REFERENCES "NDTResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NDTDefect" ADD CONSTRAINT "NDTDefect_ndtResultId_fkey" FOREIGN KEY ("ndtResultId") REFERENCES "NDTResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NDTDefect" ADD CONSTRAINT "NDTDefect_defectWelderId_fkey" FOREIGN KEY ("defectWelderId") REFERENCES "Welder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialDispatchRegister" ADD CONSTRAINT "MaterialDispatchRegister_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialDispatchItem" ADD CONSTRAINT "MaterialDispatchItem_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "MaterialDispatchRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialReceiptRegister" ADD CONSTRAINT "MaterialReceiptRegister_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialReceiptItem" ADD CONSTRAINT "MaterialReceiptItem_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "MaterialReceiptRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialDamageInspection" ADD CONSTRAINT "MaterialDamageInspection_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialDamageInspectionItem" ADD CONSTRAINT "MaterialDamageInspectionItem_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "MaterialDamageInspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialReturnRegister" ADD CONSTRAINT "MaterialReturnRegister_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialReturnItem" ADD CONSTRAINT "MaterialReturnItem_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "MaterialReturnRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRecord" ADD CONSTRAINT "ActivityRecord_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityFile" ADD CONSTRAINT "ActivityFile_activityRecordId_fkey" FOREIGN KEY ("activityRecordId") REFERENCES "ActivityRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
