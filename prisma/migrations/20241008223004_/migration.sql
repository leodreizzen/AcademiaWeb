/*
  Warnings:

  - You are about to drop the column `dateTime` on the `ReportCard` table. All the data in the column will be lost.
  - You are about to drop the `ReportCardMark` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[year,studentId]` on the table `ReportCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `ReportCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReportCardMark" DROP CONSTRAINT "ReportCardMark_reportCardId_fkey";

-- DropForeignKey
ALTER TABLE "ReportCardMark" DROP CONSTRAINT "ReportCardMark_subjectId_fkey";

-- AlterTable
ALTER TABLE "ReportCard" DROP COLUMN "dateTime",
ADD COLUMN     "firstSemesterReleased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondSemesterReleased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ReportCardMark";

-- CreateTable
CREATE TABLE "SemesterReportCardMark" (
    "id" SERIAL NOT NULL,
    "reportCardFirstSemesterId" INTEGER,
    "reportCardSecondSemesterId" INTEGER,
    "subjectId" INTEGER NOT NULL,
    "mark" INTEGER NOT NULL,

    CONSTRAINT "SemesterReportCardMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalReportCardMark" (
    "reportCardId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "mark" TEXT NOT NULL,

    CONSTRAINT "FinalReportCardMark_pkey" PRIMARY KEY ("reportCardId","subjectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SemesterReportCardMark_reportCardFirstSemesterId_reportCard_key" ON "SemesterReportCardMark"("reportCardFirstSemesterId", "reportCardSecondSemesterId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportCard_year_studentId_key" ON "ReportCard"("year", "studentId");

-- AddForeignKey
ALTER TABLE "SemesterReportCardMark" ADD CONSTRAINT "SemesterReportCardMark_reportCardFirstSemesterId_fkey" FOREIGN KEY ("reportCardFirstSemesterId") REFERENCES "ReportCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemesterReportCardMark" ADD CONSTRAINT "SemesterReportCardMark_reportCardSecondSemesterId_fkey" FOREIGN KEY ("reportCardSecondSemesterId") REFERENCES "ReportCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemesterReportCardMark" ADD CONSTRAINT "SemesterReportCardMark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalReportCardMark" ADD CONSTRAINT "FinalReportCardMark_reportCardId_fkey" FOREIGN KEY ("reportCardId") REFERENCES "ReportCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalReportCardMark" ADD CONSTRAINT "FinalReportCardMark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
