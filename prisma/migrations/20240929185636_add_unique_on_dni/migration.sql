/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_dni_key" ON "Profile"("dni");
