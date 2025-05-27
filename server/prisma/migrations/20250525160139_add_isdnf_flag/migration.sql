-- AlterTable
ALTER TABLE "GrandPrixClassement" ADD COLUMN     "is_dnf" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "position" DROP NOT NULL;
