/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `firstname` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `api_avatar_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "api_avatar_id" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shared_link" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "api_avatar_id" TEXT,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLeague" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ecurie" (
    "id_api_ecurie" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Ecurie_pkey" PRIMARY KEY ("id_api_ecurie")
);

-- CreateTable
CREATE TABLE "Pilote" (
    "id_api_pilote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pucture" TEXT NOT NULL,
    "name_acronym" TEXT NOT NULL,

    CONSTRAINT "Pilote_pkey" PRIMARY KEY ("id_api_pilote")
);

-- CreateTable
CREATE TABLE "PilotesEcurie" (
    "id" TEXT NOT NULL,
    "pilote_id" TEXT NOT NULL,
    "ecurie_id" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PilotesEcurie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrandPrix" (
    "id_api_races" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "id_api_track" TEXT NOT NULL,

    CONSTRAINT "GrandPrix_pkey" PRIMARY KEY ("id_api_races")
);

-- CreateTable
CREATE TABLE "GrandPrixClassement" (
    "id" TEXT NOT NULL,
    "id_grand_prix" TEXT NOT NULL,
    "id_grand_prix_pilote" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GrandPrixClassement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrandPrixPilote" (
    "id" TEXT NOT NULL,
    "id_grand_prix" TEXT NOT NULL,
    "id_pilote" TEXT NOT NULL,
    "id_ecurie" TEXT NOT NULL,

    CONSTRAINT "GrandPrixPilote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetsSelectionResults" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "id_grand_prix" TEXT NOT NULL,
    "point_p10" INTEGER NOT NULL,
    "id_pilote_p10" INTEGER NOT NULL,

    CONSTRAINT "BetsSelectionResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id_api_track" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "track_name" TEXT NOT NULL,
    "picture_country" TEXT NOT NULL,
    "picture_track" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id_api_track")
);

-- CreateIndex
CREATE UNIQUE INDEX "League_id_key" ON "League"("id");

-- CreateIndex
CREATE UNIQUE INDEX "League_shared_link_key" ON "League"("shared_link");

-- CreateIndex
CREATE UNIQUE INDEX "UserLeague_id_key" ON "UserLeague"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ecurie_id_api_ecurie_key" ON "Ecurie"("id_api_ecurie");

-- CreateIndex
CREATE UNIQUE INDEX "Pilote_id_api_pilote_key" ON "Pilote"("id_api_pilote");

-- CreateIndex
CREATE UNIQUE INDEX "PilotesEcurie_id_key" ON "PilotesEcurie"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GrandPrix_id_api_races_key" ON "GrandPrix"("id_api_races");

-- CreateIndex
CREATE UNIQUE INDEX "GrandPrixClassement_id_key" ON "GrandPrixClassement"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GrandPrixPilote_id_key" ON "GrandPrixPilote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BetsSelectionResults_id_key" ON "BetsSelectionResults"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_id_api_track_key" ON "Track"("id_api_track");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotesEcurie" ADD CONSTRAINT "PilotesEcurie_pilote_id_fkey" FOREIGN KEY ("pilote_id") REFERENCES "Pilote"("id_api_pilote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotesEcurie" ADD CONSTRAINT "PilotesEcurie_ecurie_id_fkey" FOREIGN KEY ("ecurie_id") REFERENCES "Ecurie"("id_api_ecurie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrandPrixClassement" ADD CONSTRAINT "GrandPrixClassement_id_grand_prix_fkey" FOREIGN KEY ("id_grand_prix") REFERENCES "GrandPrix"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrandPrixClassement" ADD CONSTRAINT "GrandPrixClassement_id_grand_prix_pilote_fkey" FOREIGN KEY ("id_grand_prix_pilote") REFERENCES "GrandPrixPilote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetsSelectionResults" ADD CONSTRAINT "BetsSelectionResults_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetsSelectionResults" ADD CONSTRAINT "BetsSelectionResults_id_grand_prix_fkey" FOREIGN KEY ("id_grand_prix") REFERENCES "GrandPrix"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;
