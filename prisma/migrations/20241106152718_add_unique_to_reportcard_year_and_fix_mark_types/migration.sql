/*
  Warnings:

  - A unique constraint covering the columns `[studentId,year]` on the table `ReportCard` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `mark` on the `FinalReportCardMark` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FinalReportCardMark" DROP COLUMN "mark",
ADD COLUMN     "mark" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SemesterReportCardMark" ALTER COLUMN "mark" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ReportCard_studentId_year_key" ON "ReportCard"("studentId", "year");
