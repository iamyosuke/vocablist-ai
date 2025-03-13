-- AlterTable
ALTER TABLE "User" ADD COLUMN     "interfaceLanguageId" INTEGER,
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studyLanguageId" INTEGER;

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");
