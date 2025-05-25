-- DropIndex
DROP INDEX "GrandPrixClassement_id_grand_prix_id_grand_prix_pilote_key";

-- AddForeignKey
ALTER TABLE "GrandPrixPilote" ADD CONSTRAINT "GrandPrixPilote_id_grand_prix_fkey" FOREIGN KEY ("id_grand_prix") REFERENCES "GrandPrix"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrandPrixPilote" ADD CONSTRAINT "GrandPrixPilote_id_pilote_fkey" FOREIGN KEY ("id_pilote") REFERENCES "Pilote"("id_api_pilote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrandPrixPilote" ADD CONSTRAINT "GrandPrixPilote_id_ecurie_fkey" FOREIGN KEY ("id_ecurie") REFERENCES "Ecurie"("id_api_ecurie") ON DELETE RESTRICT ON UPDATE CASCADE;
