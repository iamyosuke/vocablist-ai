import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getSupabaseUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const supabaseUser = await prisma.user.findUnique({
    where: { clerkUserId: userId }, 
  });

  if (!supabaseUser) {
    throw new Error('Supabase user not found');
  }

  return supabaseUser;
} 