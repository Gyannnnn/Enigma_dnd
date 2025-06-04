-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'cordinator');

-- CreateTable
CREATE TABLE "user" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userAvtar" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userRegestrationNumber" TEXT NOT NULL,
    "userRole" "role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userEmail_key" ON "user"("userEmail");
