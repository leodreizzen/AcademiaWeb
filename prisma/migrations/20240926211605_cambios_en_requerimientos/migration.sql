/*
  Warnings:

  - The primary key for the `Administrator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dni` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Administrator` table. All the data in the column will be lost.
  - Added the required column `address` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Administrator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_pkey",
DROP COLUMN "dni",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" INTEGER NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD CONSTRAINT "Administrator_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_id_fkey" FOREIGN KEY ("id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
