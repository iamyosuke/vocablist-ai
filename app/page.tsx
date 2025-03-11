"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Brain, Search, Menu, Settings as SettingsIcon, GraduationCap, Loader2, Check, X, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Settings, VocabularyItem } from "./types";
import { SettingsDialog } from "./components/settings-dialog";
import { WordDetail } from "./components/word-detail";
import { QuizModal } from "./components/quiz-modal";
import { TRANSLATIONS } from "./constants";

function getFirstParagraph(markdown: string): string {
  // Split by newlines and get first non-empty paragraph
  const paragraphs = markdown.split('\n').filter(p => p.trim());
  if (paragraphs.length === 0) return '';
  
  // Remove markdown headers and formatting
  let firstParagraph = paragraphs[0]
    .replace(/^#+\s+/, '') // Remove headers
    .replace(/[*_`]/g, ''); // Remove bold, italic, code

  // Truncate if too long
  if (firstParagraph.length > 100) {
    firstParagraph = firstParagraph.substring(0, 100) + '...';
  }

  return firstParagraph;
}

export default function Home() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [settings, setSettings] = useState<Settings>({
    interfaceLanguage: "en",
    studyLanguage: "ja",
  });
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [generatedMeaning, setGeneratedMeaning] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const t = TRANSLATIONS[settings.interfaceLanguage as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const handleGenerateMeaning = async () => {
    if (!word.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-meaning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: word.trim(),
          language: settings.studyLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate meaning");

      const data = await response.json();
      setGeneratedMeaning(data.meaning);
      setIsEditing(true);
    } catch (error) {
      console.error("Error generating meaning:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!word.trim() || !generatedMeaning.trim()) return;

    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      word: word.trim(),
      meaning: generatedMeaning,
      created_at: new Date().toISOString(),
      mastery: 0,
    };

    setVocabularyList([newItem, ...vocabularyList]);
    setWord("");
    setGeneratedMeaning("");
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setGeneratedMeaning("");
    setIsEditing(false);
  };

  const handleWordClick = (item: VocabularyItem) => {
    setSelectedWord(item);
    setIsDetailOpen(true);
  };

  const handleUpdateWord = (updatedWord: VocabularyItem) => {
    setVocabularyList(
      vocabularyList.map((item) =>
        item.id === updatedWord.id ? updatedWord : item
      )
    );
    setSelectedWord(updatedWord);
  };

  const handleQuizComplete = (results: { wordId: string; isCorrect: boolean }[]) => {
    const updatedList = vocabularyList.map(item => {
      const result = results.find(r => r.wordId === item.id);
      if (result) {
        return {
          ...item,
          mastery: Math.min(100, (item.mastery || 0) + (result.isCorrect ? 10 : -5)),
          lastReviewed: new Date().toISOString(),
        };
      }
      return item;
    });

    setVocabularyList(updatedList);
  };

  const filteredList = vocabularyList.filter(item =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="text-center mb-12 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <SettingsIcon className="h-5 w-5" />
                    {t.settings}
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => setIsQuizOpen(true)}
                  >
                    <GraduationCap className="h-5 w-5" />
                    {t.startLearning}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsQuizOpen(true)}
            >
              <GraduationCap className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-md mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vocablist AI
          </h1>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                className="pl-12 pr-4 py-6 w-full bg-white/80 backdrop-blur-sm border-0 ring-2 ring-gray-200/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg shadow-lg"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {filteredList.map((item) => (
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
                {t.added}: {new Date(item.created_at).toLocaleDateString(settings.interfaceLanguage)}
              </div>
            </Card>
          ))}
        </div>

        {filteredList.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-500 text-lg">
                {searchTerm ? t.noMatches : t.noWords}
              </p>
            </div>
          </div>
        )}

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-5 w-5 mr-2" />
                {t.addWord}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t.addWord}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder={t.enterWord}
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="border-0 ring-2 ring-gray-200/50 focus:ring-2 focus:ring-indigo-500/50"
                />
                {!isEditing ? (
                  <Button
                    onClick={handleGenerateMeaning}
                    disabled={!word.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    {t.generateMeaning}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedMeaning}
                      onChange={(e) => setGeneratedMeaning(e.target.value)}
                      className="min-h-[200px] font-mono text-sm border-0 ring-2 ring-gray-200/50 focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="Edit the generated meaning (Markdown supported)"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          settings={settings}
          onSettingsChange={setSettings}
        />

        {selectedWord && (
          <WordDetail
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            word={selectedWord}
            interfaceLanguage={settings.interfaceLanguage}
            onUpdate={handleUpdateWord}
          />
        )}

        <QuizModal
          open={isQuizOpen}
          onOpenChange={setIsQuizOpen}
          words={vocabularyList}
          interfaceLanguage={settings.interfaceLanguage}
          onComplete={handleQuizComplete}
        />
      </div>
    </div>
  );
}