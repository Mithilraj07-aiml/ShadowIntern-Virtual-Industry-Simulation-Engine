import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const user = users[0];
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }
    return NextResponse.json({
      id: user.id,
      xp: user.xp,
      name: user.name,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch XP' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: amount } },
    });

    return NextResponse.json({ id: user.id, xp: user.xp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update XP' }, { status: 500 });
  }
}
