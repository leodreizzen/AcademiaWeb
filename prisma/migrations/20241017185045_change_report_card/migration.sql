/*
  Warnings:

  - You are about to drop the column `firstSemesterReleased` on the `ReportCard` table. All the data in the column will be lost.
  - You are about to drop the column `secondSemesterReleased` on the `ReportCard` table. All the data in the column will be lost.
  - Added the required column `gradeName` to the `ReportCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ReportCard_year_studentId_key";

-- AlterTable
ALTER TABLE "ReportCard" DROP COLUMN "firstSemesterReleased",
DROP COLUMN "secondSemesterReleased",
ADD COLUMN     "gradeName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GradeReportCards" (
    "year" INTEGER NOT NULL,
    "gradeName" TEXT NOT NULL,
    "firstSemesterReleased" BOOLEAN NOT NULL DEFAULT false,
    "secondSemesterReleased" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GradeReportCards_pkey" PRIMARY KEY ("gradeName","year")
);

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_year_gradeName_fkey" FOREIGN KEY ("year", "gradeName") REFERENCES "GradeReportCards"("year", "gradeName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReportCards" ADD CONSTRAINT "GradeReportCards_gradeName_fkey" FOREIGN KEY ("gradeName") REFERENCES "Grade"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
