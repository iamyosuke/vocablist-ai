import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Prismaクライアントのインポート
import { getSupabaseUser } from '@/lib/getSupabaseUser'; // 認証のインポート

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { word, meaning } = await req.json();

  const user = await getSupabaseUser();

  try {
    const updatedItem = await prisma.vocabulary.update({
      where: { id: params.id },
      data: {
        word,
        meaning,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating vocabulary item:", error);
    return NextResponse.json({ error: 'Failed to update vocabulary item' }, { status: 500 });
  }
} 