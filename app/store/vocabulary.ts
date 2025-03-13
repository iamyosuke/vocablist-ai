import { create } from 'zustand';
import { Vocabulary } from '@prisma/client';

interface VocabularyStore {
  items: Vocabulary[];
  filteredItems: Vocabulary[];
  setItems: (items: Vocabulary[]) => void;
  setFilteredItems: (items: Vocabulary[]) => void;
  addItem: (item: Vocabulary) => void;
  updateItem: (item: Vocabulary) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useVocabularyStore = create<VocabularyStore>((set) => ({
  items: [],
  filteredItems: [],
  searchTerm: '',
  setItems: (items) => set({ items, filteredItems: items }),
  setFilteredItems: (filteredItems) => set({ filteredItems }),
  addItem: (item) => set((state) => ({ 
    items: [item, ...state.items],
    filteredItems: [item, ...state.items] 
  })),
  updateItem: (updatedItem) => set((state) => ({
    items: state.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ),
    filteredItems: state.filteredItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    )
  })),
  setSearchTerm: (searchTerm) => set((state) => ({
    searchTerm,
    filteredItems: state.items.filter(item =>
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))
})); 