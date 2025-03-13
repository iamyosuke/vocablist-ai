import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { OnboardingForm } from '../components/onboarding-form';

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // 言語データを取得
  const languages = await prisma.language.findMany({
    orderBy: { order: 'asc' },
  });

  // ユーザー情報を取得
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      interfaceLanguage: true,
      studyLanguage: true,
    },
  });

  // ユーザーが存在しない場合は作成
  if (!user) {
    redirect('/');
  }

  // すでにオンボーディングが完了している場合はホームページにリダイレクト
  if (user.isOnboarded) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">言語設定</h1>
        <p className="text-gray-600 mb-8 text-center">
          学習したい言語とインターフェースの言語を選択してください。
        </p>
        
        <OnboardingForm 
          user={user}
          languages={languages}
        />
      </div>
    </div>
  );
} 