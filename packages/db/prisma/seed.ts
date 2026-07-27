import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const client = await prisma.company.upsert({
    where: { id: "seed-client-gail" },
    update: {},
    create: { id: "seed-client-gail", name: "GAIL (India) Ltd", type: "CLIENT" },
  });

  const contractor = await prisma.company.upsert({
    where: { id: "seed-contractor-tolani" },
    update: {},
    create: { id: "seed-contractor-tolani", name: "Tolani Projects Pvt Ltd", type: "CONTRACTOR" },
  });

  const project = await prisma.project.upsert({
    where: { id: "seed-project-vijaipur-pata" },
    update: {},
    create: {
      id: "seed-project-vijaipur-pata",
      name: "Vijaipur - Pata Pipeline",
      clientCompanyId: client.id,
    },
  });

  const lineLoop = await prisma.lineLoop.upsert({
    where: { id: "seed-lineloop-14in-s3" },
    update: {},
    create: { id: "seed-lineloop-14in-s3", name: "14 Inch Section-3", projectId: project.id },
  });

  const spread = await prisma.spread.upsert({
    where: { id: "seed-spread-s3" },
    update: {},
    create: { id: "seed-spread-s3", name: "Section-3", lineLoopId: lineLoop.id },
  });

  const users: { username: string; name: string; role: "CLIENT" | "CONTRACTOR_ADMIN" | "ENTRY_USER" | "REPORTING_USER"; companyId: string }[] = [
    { username: "client_admin", name: "GAIL Client Admin", role: "CLIENT", companyId: client.id },
    { username: "contractor_admin", name: "Tolani Contractor Admin", role: "CONTRACTOR_ADMIN", companyId: contractor.id },
    { username: "entry_user", name: "Rahul Singh", role: "ENTRY_USER", companyId: contractor.id },
    { username: "report_user", name: "Reporting Viewer", role: "REPORTING_USER", companyId: client.id },
  ];

  const defaultPasswordHash = await bcrypt.hash("Pims@12345", 10);

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        name: u.name,
        role: u.role,
        companyId: u.companyId,
        passwordHash: defaultPasswordHash,
      },
    });
    await prisma.projectMember.upsert({
      where: { userId_projectId: { userId: user.id, projectId: project.id } },
      update: {},
      create: { userId: user.id, projectId: project.id },
    });
  }

  const wps = await prisma.wPS.upsert({
    where: { spreadId_wpsNo: { spreadId: spread.id, wpsNo: "WPS-001" } },
    update: {},
    create: {
      wpsNo: "WPS-001",
      companyId: contractor.id,
      spreadId: spread.id,
      weldingProgression: "Downhill",
      weldingProcess: "SMAW",
      jointVersionGroup: "V1",
      jointTypeGroup: "Girth Weld",
      diameterFrom: 14,
      diameterTo: 14,
      wallThicknessFrom: 8.7,
      wallThicknessTo: 8.7,
      materialGradeFrom: "API 5L X70",
      materialGradeTo: "API 5L X70",
      noOfWelders: 2,
    },
  });

  const welder = await prisma.welder.upsert({
    where: { companyId_welderCode: { companyId: contractor.id, welderCode: "W-101" } },
    update: {},
    create: { companyId: contractor.id, welderCode: "W-101", name: "Suresh Kumar", stampNo: "S101" },
  });

  const pipeCount = await prisma.pipe.count({ where: { spreadId: spread.id } });
  if (pipeCount === 0) {
    await prisma.pipe.createMany({
      data: Array.from({ length: 25 }).map((_, i) => ({
        spreadId: spread.id,
        pipeNo: `1E25G4${5500 + i}`,
        displayPipeNo: `1E25G4${5500 + i}`,
        heatNo: `A2952${20 + (i % 8)}`,
        length: 12.1 + (i % 5) * 0.1,
        diameter: 14,
        wallThickness: 8.7,
        coatingNo: `CP25G2004-EXT-A${7000 + i}`,
        status: i < 15 ? "STRUNG" : "IN_STOCK",
      })),
    });
  }

  console.log("Seed complete:");
  console.log({ client: client.name, contractor: contractor.name, project: project.name, lineLoop: lineLoop.name, spread: spread.name, wps: wps.wpsNo, welder: welder.name });
  console.log("Login with any of:", users.map((u) => u.username).join(", "), "- password: Pims@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
