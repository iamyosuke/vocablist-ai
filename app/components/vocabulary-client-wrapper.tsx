"use client";

import { useEffect } from 'react';
import { SearchBar } from './search-bar';
import { VocabularyList } from './vocabulary-list';
import { AddWordDialog } from './add-word-dialog';
import { useVocabularyStore } from '@/app/store/vocabulary';
import type { Vocabulary } from '@prisma/client';

interface VocabularyClientWrapperProps {
  initialItems: Vocabulary[];
  t: any;
}

export function VocabularyClientWrapper({ initialItems, t }: VocabularyClientWrapperProps) {
  const setItems = useVocabularyStore(state => state.setItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems, setItems]);

  return (
    <>
      <SearchBar placeholder={t.search} />
      <VocabularyList t={t} />
      <AddWordDialog t={t} onSave={() => {}} />
    </>
  );
} 