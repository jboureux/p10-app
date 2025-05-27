/*
  Warnings:

  - Added the required column `id_pilote_dnf` to the `BetSelectionResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BetSelectionResult" ADD COLUMN     "id_pilote_dnf" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_pilote_dnf_fkey" FOREIGN KEY ("id_pilote_dnf") REFERENCES "GrandPrixPilote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
