/*
  Warnings:

  - Changed the type of `role` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Parent', 'Teacher', 'Student', 'Administrator');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_dni_role_key" ON "Profile"("dni", "role");
