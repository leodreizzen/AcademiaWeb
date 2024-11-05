/*
  Warnings:

  - The primary key for the `ExamMark` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[examId,studentId]` on the table `ExamMark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- AlterTable
ALTER TABLE "ExamMark" DROP CONSTRAINT "ExamMark_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ExamMark_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AttendanceData" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "gradeName" TEXT NOT NULL,

    CONSTRAINT "AttendanceData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceItem" (
    "attendanceDataid" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "AttendanceItem_pkey" PRIMARY KEY ("attendanceDataid","studentId")
);

-- CreateTable
CREATE TABLE "Signature" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "reprimandId" INTEGER,
    "examId" INTEGER,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignatureToken" (
    "id" SERIAL NOT NULL,
    "token" INTEGER NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reprimandId" INTEGER,
    "examId" INTEGER,
    "parentId" INTEGER NOT NULL,

    CONSTRAINT "SignatureToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "senderDni" INTEGER NOT NULL,
    "recipientDni" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceData_gradeName_date_key" ON "AttendanceData"("gradeName", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Signature_reprimandId_key" ON "Signature"("reprimandId");

-- CreateIndex
CREATE UNIQUE INDEX "Signature_examId_key" ON "Signature"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "SignatureToken_reprimandId_key" ON "SignatureToken"("reprimandId");

-- CreateIndex
CREATE UNIQUE INDEX "SignatureToken_examId_key" ON "SignatureToken"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamMark_examId_studentId_key" ON "ExamMark"("examId", "studentId");

-- AddForeignKey
ALTER TABLE "AttendanceData" ADD CONSTRAINT "AttendanceData_gradeName_fkey" FOREIGN KEY ("gradeName") REFERENCES "Grade"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceItem" ADD CONSTRAINT "AttendanceItem_attendanceDataid_fkey" FOREIGN KEY ("attendanceDataid") REFERENCES "AttendanceData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceItem" ADD CONSTRAINT "AttendanceItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_reprimandId_fkey" FOREIGN KEY ("reprimandId") REFERENCES "Reprimand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ExamMark"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureToken" ADD CONSTRAINT "SignatureToken_reprimandId_fkey" FOREIGN KEY ("reprimandId") REFERENCES "Reprimand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureToken" ADD CONSTRAINT "SignatureToken_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ExamMark"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureToken" ADD CONSTRAINT "SignatureToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderDni_fkey" FOREIGN KEY ("senderDni") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientDni_fkey" FOREIGN KEY ("recipientDni") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;
