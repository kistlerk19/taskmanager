// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const existingTeam = await prisma.team.findFirst({
    where: { teamName: "Default Team" },
  });

  if (!existingTeam) {
    await prisma.team.create({
      data: {
        teamName: "Default Team",
      },
    });
    console.log("✅ Default Team created");
  } else {
    console.log("ℹ️ Default Team already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });