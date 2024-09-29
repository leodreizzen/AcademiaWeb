/*
  Warnings:

  - A unique constraint covering the columns `[dni,role]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Profile_dni_key";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_dni_role_key" ON "Profile"("dni", "role");
