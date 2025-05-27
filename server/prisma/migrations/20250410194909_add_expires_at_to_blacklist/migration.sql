/*
  Warnings:

  - Added the required column `expiresAt` to the `BlacklistedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Étape 1 : ajouter la colonne nullable temporairement
ALTER TABLE "BlacklistedToken" ADD COLUMN "expiresAt" TIMESTAMP;

-- Étape 2 : remplir avec une valeur de fallback pour les anciennes lignes
UPDATE "BlacklistedToken" SET "expiresAt" = NOW() + interval '7 days' WHERE "expiresAt" IS NULL;

-- Étape 3 : rendre la colonne NOT NULL après coup
ALTER TABLE "BlacklistedToken" ALTER COLUMN "expiresAt" SET NOT NULL;
