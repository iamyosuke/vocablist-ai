'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Language } from '@prisma/client';

interface OnboardingFormProps {
  languages: Language[];
}

export function OnboardingForm({ languages }: OnboardingFormProps) {
  const router = useRouter();
  
  // デフォルト値を設定
  const [interfaceLanguageId, setInterfaceLanguageId] = useState<number | undefined>(languages.find(language => language.code === 'en')?.id);
  const [studyLanguageId, setStudyLanguageId] = useState<number | undefined>(languages.find(language => language.code === 'ja')?.id);
  const [isLoading, setIsLoading] = useState(false);
  
  // コンポーネントマウント時にデフォルト値を設定
  // useEffect(() => {
  //   const defaultInterfaceLanguage = languages.find(language => language.code === 'en');
  //   const defaultStudyLanguage = languages.find(language => language.code === 'ja');
    
  //   if (defaultInterfaceLanguage) {
  //     setInterfaceLanguageId(defaultInterfaceLanguage.id);
  //   }
    
  //   if (defaultStudyLanguage) {
  //     setStudyLanguageId(defaultStudyLanguage.id);
  //   }
  // }, [languages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(interfaceLanguageId, studyLanguageId);
    if (!interfaceLanguageId || !studyLanguageId) {
      console.log('interfaceLanguageId or studyLanguageId is undefined');
      return;
    }
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interfaceLanguageId,
          studyLanguageId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="interfaceLanguageId" className="block text-sm font-medium text-gray-700 mb-1">
          インターフェース言語
        </label>
        <select
          id="interfaceLanguageId"
          value={interfaceLanguageId || ''}
          onChange={(e) => setInterfaceLanguageId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">言語を選択してください</option>
          {languages.filter(language => language.isInterface).map((language) => (
            <option key={language.id} value={language.id}>
              {language.name} ({language.nameEn})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="studyLanguageId" className="block text-sm font-medium text-gray-700 mb-1">
          学習言語
        </label>
        <select
          id="studyLanguageId"
          value={studyLanguageId || ''}
          onChange={(e) => setStudyLanguageId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">言語を選択してください</option>
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name} ({language.nameEn})
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? '保存中...' : '設定を保存'}
      </button>
    </form>
  );
} 