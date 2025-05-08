const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const sampleEvents = [
    { title: "Real Madrid vs Liverpool",       date: new Date("2025-05-31T20:00:00.000Z") },
    { title: "Barcelona vs PSG",               date: new Date("2025-06-03T21:00:00.000Z") },
    { title: "Manchester City vs Chelsea",     date: new Date("2025-06-07T18:30:00.000Z") },
    { title: "Bayern Munich vs Dortmund",      date: new Date("2025-06-10T19:00:00.000Z") },
    { title: "Juventus vs AC Milan",           date: new Date("2025-06-12T20:45:00.000Z") },
  ];

  for (const evt of sampleEvents) {
    await prisma.event.create({ data: evt });
  }

  console.log("Seeded events ✔");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
