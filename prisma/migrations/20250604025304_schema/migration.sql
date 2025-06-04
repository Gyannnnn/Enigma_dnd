/*
  Warnings:

  - The values [cordinator] on the enum `role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userRegestrationNumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('admin', 'coordinator');
ALTER TABLE "user" ALTER COLUMN "userRole" TYPE "role_new" USING ("userRole"::text::"role_new");
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "role_old";
COMMIT;

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishd" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '[]',
    "visits" INTEGER NOT NULL DEFAULT 0,
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "shareUrl" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FormSubmissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Form_id_publishd_createdAt_idx" ON "Form"("id", "publishd", "createdAt");

-- CreateIndex
CREATE INDEX "FormSubmissions_id_formId_userId_idx" ON "FormSubmissions"("id", "formId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_userRegestrationNumber_key" ON "user"("userRegestrationNumber");

-- CreateIndex
CREATE INDEX "user_userId_userRole_userEmail_idx" ON "user"("userId", "userRole", "userEmail");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissions" ADD CONSTRAINT "FormSubmissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissions" ADD CONSTRAINT "FormSubmissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
