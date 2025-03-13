import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { interfaceLanguageId, studyLanguageId } = await req.json();

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // 言語IDの検証
    const interfaceLanguage = await prisma.language.findUnique({
      where: { id: interfaceLanguageId },
    });

    const studyLanguage = await prisma.language.findUnique({
      where: { id: studyLanguageId },
    });

    if (!interfaceLanguage || !studyLanguage) {
      return new NextResponse('Invalid language selection', { status: 400 });
    }

    // ユーザー設定を更新
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        interfaceLanguageId,
        studyLanguageId,
        isOnboarded: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 