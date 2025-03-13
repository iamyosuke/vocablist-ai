import { prisma } from '@/lib/prisma';
import {getRequestConfig} from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';
export default getRequestConfig(async () => {
  let locale = 'en';
  
  const { userId } = await auth();
  if (userId) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      interfaceLanguage: true,
      studyLanguage: true,
      },
    });
    locale = user?.interfaceLanguage?.code || 'en';
  } else {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});