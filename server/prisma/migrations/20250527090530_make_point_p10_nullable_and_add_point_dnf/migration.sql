-- AlterTable
ALTER TABLE "BetSelectionResult" ADD COLUMN     "point_dnf" INTEGER,
ALTER COLUMN "point_p10" DROP NOT NULL;
