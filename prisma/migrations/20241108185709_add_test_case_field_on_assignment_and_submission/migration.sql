-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "testCase" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "testCase" BOOLEAN NOT NULL DEFAULT false;
