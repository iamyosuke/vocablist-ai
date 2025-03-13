-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_interfaceLanguageId_fkey" FOREIGN KEY ("interfaceLanguageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studyLanguageId_fkey" FOREIGN KEY ("studyLanguageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;
