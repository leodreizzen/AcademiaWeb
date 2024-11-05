/*
  Warnings:

  - You are about to drop the column `reprimandId` on the `Signature` table. All the data in the column will be lost.
  - You are about to drop the column `reprimandId` on the `SignatureToken` table. All the data in the column will be lost.
  - You are about to drop the `_ReprimandToStudent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reprimandStudentId,reprimandReprimandId]` on the table `Signature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reprimandStudentId,reprimandReprimandId]` on the table `SignatureToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_reprimandId_fkey";

-- DropForeignKey
ALTER TABLE "SignatureToken" DROP CONSTRAINT "SignatureToken_reprimandId_fkey";

-- DropForeignKey
ALTER TABLE "_ReprimandToStudent" DROP CONSTRAINT "_ReprimandToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReprimandToStudent" DROP CONSTRAINT "_ReprimandToStudent_B_fkey";

-- DropIndex
DROP INDEX "Signature_reprimandId_key";

-- DropIndex
DROP INDEX "SignatureToken_reprimandId_key";

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "reprimandId",
ADD COLUMN     "reprimandReprimandId" INTEGER,
ADD COLUMN     "reprimandStudentId" INTEGER;

-- AlterTable
ALTER TABLE "SignatureToken" DROP COLUMN "reprimandId",
ADD COLUMN     "reprimandReprimandId" INTEGER,
ADD COLUMN     "reprimandStudentId" INTEGER;

-- DropTable
DROP TABLE "_ReprimandToStudent";

-- CreateTable
CREATE TABLE "ReprimandStudent" (
    "studentId" INTEGER NOT NULL,
    "reprimandId" INTEGER NOT NULL,
    "signatureId" INTEGER,

    CONSTRAINT "ReprimandStudent_pkey" PRIMARY KEY ("studentId","reprimandId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_id_key" ON "Grade"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Signature_reprimandStudentId_reprimandReprimandId_key" ON "Signature"("reprimandStudentId", "reprimandReprimandId");

-- CreateIndex
CREATE UNIQUE INDEX "SignatureToken_reprimandStudentId_reprimandReprimandId_key" ON "SignatureToken"("reprimandStudentId", "reprimandReprimandId");

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_reprimandStudentId_reprimandReprimandId_fkey" FOREIGN KEY ("reprimandStudentId", "reprimandReprimandId") REFERENCES "ReprimandStudent"("studentId", "reprimandId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReprimandStudent" ADD CONSTRAINT "ReprimandStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReprimandStudent" ADD CONSTRAINT "ReprimandStudent_reprimandId_fkey" FOREIGN KEY ("reprimandId") REFERENCES "Reprimand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureToken" ADD CONSTRAINT "SignatureToken_reprimandStudentId_reprimandReprimandId_fkey" FOREIGN KEY ("reprimandStudentId", "reprimandReprimandId") REFERENCES "ReprimandStudent"("studentId", "reprimandId") ON DELETE SET NULL ON UPDATE CASCADE;
