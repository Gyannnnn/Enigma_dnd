/*
  Warnings:

  - You are about to drop the column `userRegestrationNumber` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userRegistrationNumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userRegistrationNumber` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_userRegestrationNumber_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userRegestrationNumber",
ADD COLUMN     "userRegistrationNumber" TEXT NOT NULL,
ALTER COLUMN "userRole" SET DEFAULT 'admin';

-- CreateIndex
CREATE UNIQUE INDEX "user_userRegistrationNumber_key" ON "user"("userRegistrationNumber");
