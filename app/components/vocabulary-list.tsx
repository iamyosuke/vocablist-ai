"use client";

import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { getFirstParagraph } from "@/app/utils";
import { useVocabularyStore } from "@/app/store/vocabulary";
import { Vocabulary } from "@prisma/client";
import { useTranslations } from "next-intl";

export function VocabularyList() {
  const { filteredItems, setSelectedWord, setIsDetailOpen } = useVocabularyStore();
  const t = useTranslations('vocabulary');

  const handleWordClick = (item: Vocabulary) => {
    setSelectedWord(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24 mt-8">
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          className="group relative bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200/50 cursor-pointer"
          onClick={() => handleWordClick(item)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {item.word}
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <p className="text-gray-600 text-sm line-clamp-3">
            {getFirstParagraph(item.meaning)}
          </p>
          <div className="text-sm text-gray-500 mt-4 border-t border-gray-100 pt-4">
            {t('added')}: {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </Card>
      ))}

      {filteredItems.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-500 text-lg">
              {t('noWords')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 