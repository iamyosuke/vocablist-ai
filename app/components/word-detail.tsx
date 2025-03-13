"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVocabularyStore } from "@/app/store/vocabulary";
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, Pencil, Check, X } from "lucide-react";

export function WordDetail() {
  const { selectedWord, isDetailOpen, setIsDetailOpen, updateItem, setSelectedWord } = useVocabularyStore();
  const t = useTranslations('word-detail');
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeaning, setEditedMeaning] = useState(selectedWord?.meaning || "");

  useEffect(() => {
    if (selectedWord) {
      setEditedMeaning(selectedWord.meaning);
    }
  }, [selectedWord]);

  if (!selectedWord) return null;
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(selectedWord.word);
    window.speechSynthesis.speak(utterance);
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/vocabulary/${selectedWord.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: selectedWord.word,
          meaning: editedMeaning,
        }),
      });

      if (!response.ok) throw new Error("Failed to update vocabulary item");

      const updatedItem = await response.json();
      setSelectedWord(updatedItem);
      setEditedMeaning(updatedItem.meaning);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating vocabulary item:", error);
    }
  };

  const handleCancel = () => {
    setEditedMeaning(selectedWord.meaning);
    setIsEditing(false);
  };

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] p-4 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
              {selectedWord.word}
            </span>
            <div className="flex gap-1 sm:gap-2">
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-indigo-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-indigo-50"
                onClick={handleSpeak}
              >
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedMeaning}
                onChange={(e) => setEditedMeaning(e.target.value)}
                className="min-h-[200px] max-h-[50vh] font-mono text-sm resize-none"
                placeholder="Enter meaning (Markdown supported)"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="h-8 sm:h-9 px-2 sm:px-3 text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleEdit}
                  className="h-8 sm:h-9 px-2 sm:px-3 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {t('save')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-3 sm:p-4 max-h-[50vh] overflow-y-auto">
              <ReactMarkdown>{selectedWord.meaning}</ReactMarkdown>
            </div>
          )}

          <div className="flex justify-end text-xs sm:text-sm text-gray-500 pt-2">
            <span>{t('added')}: {new Date(selectedWord.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}