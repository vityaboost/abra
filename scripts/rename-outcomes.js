// scripts/rename-outcomes.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('⚙️  Переименование исходов прогнозов...')
  const winRes = await prisma.prediction.updateMany({
    where: { outcome: 'win' },
    data: { outcome: 'home' },
  })
  console.log(`  → ${winRes.count} записей win→home`)

  const lossRes = await prisma.prediction.updateMany({
    where: { outcome: 'loss' },
    data: { outcome: 'away' },
  })
  console.log(`  → ${lossRes.count} записей loss→away`)

  console.log('✅ Переименование завершено.')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка в скрипте:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
