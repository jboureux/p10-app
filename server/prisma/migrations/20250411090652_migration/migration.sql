/*
  Warnings:

  - You are about to drop the column `pucture` on the `Pilote` table. All the data in the column will be lost.
  - You are about to drop the `PilotesEcurie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `picture` to the `Pilote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PilotesEcurie" DROP CONSTRAINT "PilotesEcurie_ecurie_id_fkey";

-- DropForeignKey
ALTER TABLE "PilotesEcurie" DROP CONSTRAINT "PilotesEcurie_pilote_id_fkey";

-- AlterTable
ALTER TABLE "Pilote" DROP COLUMN "pucture",
ADD COLUMN     "picture" TEXT NOT NULL;

-- DropTable
DROP TABLE "PilotesEcurie";

-- CreateTable
CREATE TABLE "PiloteEcurie" (
    "id" TEXT NOT NULL,
    "pilote_id" TEXT NOT NULL,
    "ecurie_id" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PiloteEcurie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PiloteEcurie_id_key" ON "PiloteEcurie"("id");

-- AddForeignKey
ALTER TABLE "PiloteEcurie" ADD CONSTRAINT "PiloteEcurie_pilote_id_fkey" FOREIGN KEY ("pilote_id") REFERENCES "Pilote"("id_api_pilote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PiloteEcurie" ADD CONSTRAINT "PiloteEcurie_ecurie_id_fkey" FOREIGN KEY ("ecurie_id") REFERENCES "Ecurie"("id_api_ecurie") ON DELETE RESTRICT ON UPDATE CASCADE;
