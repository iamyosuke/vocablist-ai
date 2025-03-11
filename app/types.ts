export type Language = {
  code: string;
  name: string;
};

export type Settings = {
  interfaceLanguage: string;
  studyLanguage: string;
};

export type VocabularyItem = {
  id: string;
  word: string;
  meaning: string;
  created_at: string;
  mastery?: number; // 0-100
  lastReviewed?: string;
};

export type FlashcardItem = {
  word: VocabularyItem;
  isFlipped: boolean;
  isCorrect?: boolean;
};