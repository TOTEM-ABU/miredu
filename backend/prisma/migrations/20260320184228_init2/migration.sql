/*
  Warnings:

  - You are about to drop the column `otpCode` on the `STUDENT` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpires` on the `STUDENT` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `ADMIN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `STUDENT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `TEACHER` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ADMIN" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ADMIN" ("createdAt", "email", "id", "name", "password", "refreshToken", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "refreshToken", "role", "updatedAt" FROM "ADMIN";
DROP TABLE "ADMIN";
ALTER TABLE "new_ADMIN" RENAME TO "ADMIN";
CREATE UNIQUE INDEX "ADMIN_email_key" ON "ADMIN"("email");
CREATE TABLE "new_STUDENT" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "parentsPhoneNumber" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_STUDENT" ("balance", "createdAt", "email", "firstName", "id", "isVerified", "lastName", "parentsPhoneNumber", "password", "phoneNumber", "refreshToken", "role", "updatedAt") SELECT "balance", "createdAt", "email", "firstName", "id", "isVerified", "lastName", "parentsPhoneNumber", "password", "phoneNumber", "refreshToken", "role", "updatedAt" FROM "STUDENT";
DROP TABLE "STUDENT";
ALTER TABLE "new_STUDENT" RENAME TO "STUDENT";
CREATE UNIQUE INDEX "STUDENT_email_key" ON "STUDENT"("email");
CREATE UNIQUE INDEX "STUDENT_phoneNumber_key" ON "STUDENT"("phoneNumber");
CREATE UNIQUE INDEX "STUDENT_parentsPhoneNumber_key" ON "STUDENT"("parentsPhoneNumber");
CREATE TABLE "new_TEACHER" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TEACHER',
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TEACHER" ("createdAt", "email", "id", "name", "password", "phoneNumber", "refreshToken", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "phoneNumber", "refreshToken", "role", "updatedAt" FROM "TEACHER";
DROP TABLE "TEACHER";
ALTER TABLE "new_TEACHER" RENAME TO "TEACHER";
CREATE UNIQUE INDEX "TEACHER_email_key" ON "TEACHER"("email");
CREATE UNIQUE INDEX "TEACHER_phoneNumber_key" ON "TEACHER"("phoneNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
