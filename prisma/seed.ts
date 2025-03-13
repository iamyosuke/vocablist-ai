// npx prisma db seed
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 言語データをシード
  const languages = [
    { code: 'en', name: 'English', nameEn: 'English', order: 1 },
    { code: 'ja', name: '日本語', nameEn: 'Japanese', order: 2 },
    { code: 'es', name: 'Español', nameEn: 'Spanish', order: 3 },
    { code: 'fr', name: 'Français', nameEn: 'French', order: 4 },
    { code: 'de', name: 'Deutsch', nameEn: 'German', order: 5 },
    { code: 'zh', name: '中文', nameEn: 'Chinese', order: 6 },
    { code: 'pl', name: 'Polish', nameEn: 'Polish', order: 7 },
    
  ]

  // データベースにシードデータを挿入
  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: language,
      create: language,
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 