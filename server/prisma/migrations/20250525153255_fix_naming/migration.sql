/*
  Warnings:

  - You are about to drop the `BetsSelectionResults` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BetsSelectionResults" DROP CONSTRAINT "BetsSelectionResults_id_grand_prix_fkey";

-- DropForeignKey
ALTER TABLE "BetsSelectionResults" DROP CONSTRAINT "BetsSelectionResults_id_pilote_p10_fkey";

-- DropForeignKey
ALTER TABLE "BetsSelectionResults" DROP CONSTRAINT "BetsSelectionResults_user_id_fkey";

-- DropIndex
DROP INDEX "GrandPrixClassement_id_grand_prix_id_grand_prix_pilote_key";

-- DropTable
DROP TABLE "BetsSelectionResults";

-- CreateTable
CREATE TABLE "BetSelectionResult" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "id_grand_prix" TEXT NOT NULL,
    "point_p10" INTEGER NOT NULL,
    "id_pilote_p10" TEXT NOT NULL,

    CONSTRAINT "BetSelectionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BetSelectionResult_id_key" ON "BetSelectionResult"("id");

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_grand_prix_fkey" FOREIGN KEY ("id_grand_prix") REFERENCES "GrandPrix"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_pilote_p10_fkey" FOREIGN KEY ("id_pilote_p10") REFERENCES "GrandPrixPilote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
