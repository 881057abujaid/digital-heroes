/*
  Warnings:

  - The values [PUBLIDHED] on the enum `DrawStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DrawStatus_new" AS ENUM ('DRAFT', 'SIMULATED', 'PUBLISHED', 'COMPLETED');
ALTER TABLE "public"."Draw" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Draw" ALTER COLUMN "status" TYPE "DrawStatus_new" USING ("status"::text::"DrawStatus_new");
ALTER TYPE "DrawStatus" RENAME TO "DrawStatus_old";
ALTER TYPE "DrawStatus_new" RENAME TO "DrawStatus";
DROP TYPE "public"."DrawStatus_old";
ALTER TABLE "Draw" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
