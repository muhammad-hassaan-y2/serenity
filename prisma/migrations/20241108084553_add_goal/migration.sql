/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Goal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "progress" DROP DEFAULT,
ALTER COLUMN "completed" DROP DEFAULT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
