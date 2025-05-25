/*
  Warnings:

  - A unique constraint covering the columns `[id_grand_prix,id_grand_prix_pilote]` on the table `GrandPrixClassement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GrandPrixClassement_id_grand_prix_id_grand_prix_pilote_key" ON "GrandPrixClassement"("id_grand_prix", "id_grand_prix_pilote");
