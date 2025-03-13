import { getSupabaseUser } from '@/lib/getSupabaseUser';
import { prisma } from '@/lib/prisma';
import { Brain } from "lucide-react";
import { VocabularyClientWrapper } from './components/vocabulary-client-wrapper';
import { Vocabulary } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
async function getVocabularyItems(supabaseUserId: string) {
  return await prisma.vocabulary.findMany({
    where: { userId: supabaseUserId},
    orderBy: { createdAt: 'desc' },
  });
}

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  let supabaseUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!supabaseUser) {
    supabaseUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
      },
    });
  }

  const vocabularyItems = await getVocabularyItems(supabaseUser.id);
  const defaultSettings = {
    interfaceLanguage: "en",
    studyLanguage: "ja",
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-md mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vocablist AI
          </h1>
        </div>

        <VocabularyClientWrapper 
          initialItems={vocabularyItems as Vocabulary[]}
        />
      </div>
    </div>
  );
}