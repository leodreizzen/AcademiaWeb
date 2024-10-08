/*
  Warnings:

  - You are about to drop the column `email` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Administrator" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
