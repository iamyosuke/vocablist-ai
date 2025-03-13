"use client";

import { useEffect } from 'react';
import { SearchBar } from './search-bar';
import { VocabularyList } from './vocabulary-list';
import { AddWordDialog } from './add-word-dialog';
import { useVocabularyStore } from '@/app/store/vocabulary';
import type { Vocabulary } from '@prisma/client';
import { WordDetail } from './word-detail';
interface VocabularyClientWrapperProps {
  initialItems: Vocabulary[];
}

export function VocabularyClientWrapper({ initialItems }: VocabularyClientWrapperProps) {
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