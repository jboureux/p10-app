import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addDnfFlag() {
  console.log('🔄 Ajout du champ isDnf à GrandPrixClassement...');

  try {
    // Exécuter la migration SQL directement
    await prisma.$executeRaw`
      ALTER TABLE "GrandPrixClassement" 
      ADD COLUMN IF NOT EXISTS "is_dnf" BOOLEAN NOT NULL DEFAULT false;
    `;

    // Rendre la colonne position nullable
    await prisma.$executeRaw`
      ALTER TABLE "GrandPrixClassement" 
      ALTER COLUMN "position" DROP NOT NULL;
    `;

    console.log('✅ Migration terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDnfFlag();
