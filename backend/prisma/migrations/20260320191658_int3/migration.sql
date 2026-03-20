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
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ADMIN" ("avatar", "createdAt", "email", "id", "name", "password", "refreshToken", "role", "updatedAt") SELECT "avatar", "createdAt", "email", "id", "name", "password", "refreshToken", "role", "updatedAt" FROM "ADMIN";
DROP TABLE "ADMIN";
ALTER TABLE "new_ADMIN" RENAME TO "ADMIN";
CREATE UNIQUE INDEX "ADMIN_email_key" ON "ADMIN"("email");
CREATE TABLE "new_TEACHER" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TEACHER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TEACHER" ("avatar", "createdAt", "email", "id", "name", "password", "phoneNumber", "refreshToken", "role", "updatedAt") SELECT "avatar", "createdAt", "email", "id", "name", "password", "phoneNumber", "refreshToken", "role", "updatedAt" FROM "TEACHER";
DROP TABLE "TEACHER";
ALTER TABLE "new_TEACHER" RENAME TO "TEACHER";
CREATE UNIQUE INDEX "TEACHER_email_key" ON "TEACHER"("email");
CREATE UNIQUE INDEX "TEACHER_phoneNumber_key" ON "TEACHER"("phoneNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
