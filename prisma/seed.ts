import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

import { PrismaClient } from '../lib/generated/prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set')

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: await bcrypt.hash(password, 12) },
  })
  console.log('Admin user seeded.')
}

main().finally(() => pool.end())
