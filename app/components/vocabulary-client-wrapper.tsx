"use client";

import { useEffect } from 'react';
import { SearchBar } from './search-bar';
import { VocabularyList } from './vocabulary-list';
import { AddWordDialog } from './add-word-dialog';
import { useVocabularyStore } from '@/app/store/vocabulary';
import { WordDetail } from './word-detail';
import { Vocabulary } from '@prisma/client';
import { User, Language } from '@prisma/client';
interface VocabularyClientWrapperProps {
  initialItems: Vocabulary[];
  user: User & {
    interfaceLanguage: Language;
    studyLanguage: Language;
  };
}

export function VocabularyClientWrapper({ initialItems, user }: VocabularyClientWrapperProps) {
  const setItems = useVocabularyStore(state => state.setItems);
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems, setItems]);


  return (
    <>
      <SearchBar />
      <VocabularyList />
      <AddWordDialog />
      <WordDetail />
    </>
  );
} 