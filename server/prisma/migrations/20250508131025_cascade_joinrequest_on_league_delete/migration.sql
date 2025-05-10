-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_league_id_fkey";

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
