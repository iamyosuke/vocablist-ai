import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSupabaseUser } from '@/lib/getSupabaseUser';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { word, meaning } = await req.json();
    const supabaseUser = await getSupabaseUser();

    const data = await prisma.vocabulary.create({
      data: {
        userId: supabaseUser.id,
        word,
        meaning,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in vocabulary API:', error);
    return NextResponse.json({ error: 'Failed to save vocabulary item' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabaseUser = await getSupabaseUser();

    const data = await prisma.vocabulary.findMany({
      where: { userId: supabaseUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in vocabulary API:', error);
    return NextResponse.json({ error: 'Failed to fetch vocabulary items' }, { status: 500 });
  }
}
