-- DropForeignKey
ALTER TABLE "UserLeague" DROP CONSTRAINT "UserLeague_league_id_fkey";

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
