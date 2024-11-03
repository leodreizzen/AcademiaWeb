/*
  Warnings:

  - You are about to drop the column `examId` on the `SignatureToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examMarkId]` on the table `SignatureToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SignatureToken" DROP CONSTRAINT "SignatureToken_examId_fkey";

-- DropIndex
DROP INDEX "SignatureToken_examId_key";

-- AlterTable
ALTER TABLE "SignatureToken" DROP COLUMN "examId",
ADD COLUMN     "examMarkId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "SignatureToken_examMarkId_key" ON "SignatureToken"("examMarkId");

-- AddForeignKey
ALTER TABLE "SignatureToken" ADD CONSTRAINT "SignatureToken_examMarkId_fkey" FOREIGN KEY ("examMarkId") REFERENCES "ExamMark"("id") ON DELETE SET NULL ON UPDATE CASCADE;
