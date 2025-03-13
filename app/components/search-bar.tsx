"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useVocabularyStore } from "@/app/store/vocabulary";
import { useTranslations } from 'next-intl';

export function SearchBar() {
  const { searchTerm, setSearchTerm } = useVocabularyStore();
  const t = useTranslations('search-bar');

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25" />
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          className="pl-12 pr-4 py-6 w-full bg-white/80 backdrop-blur-sm border-0 ring-2 ring-gray-200/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg shadow-lg"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
} 