"use client";

import { useState } from "react";
import { Plus, Brain, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddWordDialogProps {
  t: any;
  onSave: (word: string, meaning: string) => void;
}

export function AddWordDialog({ t, onSave }: AddWordDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [word, setWord] = useState("");
  const [generatedMeaning, setGeneratedMeaning] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
          language: "ja", // TODO: 言語設定を props から受け取る
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
    onSave(word.trim(), generatedMeaning);
    setWord("");
    setGeneratedMeaning("");
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setGeneratedMeaning("");
    setIsEditing(false);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" />
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
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t.save}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 