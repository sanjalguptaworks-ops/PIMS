/*
  Warnings:

  - You are about to drop the column `inspectorName` on the `MaterialDispatchRegister` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MaterialDispatchRegister" DROP COLUMN "inspectorName",
ADD COLUMN     "inspectorId" TEXT;

-- CreateTable
CREATE TABLE "Signatory" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signatory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchRegisterSignatory" (
    "id" TEXT NOT NULL,
    "registerId" TEXT NOT NULL,
    "signatoryId" TEXT NOT NULL,

    CONSTRAINT "DispatchRegisterSignatory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DispatchRegisterSignatory_registerId_signatoryId_key" ON "DispatchRegisterSignatory"("registerId", "signatoryId");

-- AddForeignKey
ALTER TABLE "Signatory" ADD CONSTRAINT "Signatory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialDispatchRegister" ADD CONSTRAINT "MaterialDispatchRegister_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "Inspector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchRegisterSignatory" ADD CONSTRAINT "DispatchRegisterSignatory_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "MaterialDispatchRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchRegisterSignatory" ADD CONSTRAINT "DispatchRegisterSignatory_signatoryId_fkey" FOREIGN KEY ("signatoryId") REFERENCES "Signatory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
