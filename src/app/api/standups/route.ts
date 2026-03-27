import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const standups = await prisma.standup.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(standups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch standups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const standup = await prisma.standup.create({
      data: {
        userId: body.userId,
        yesterday: body.yesterday,
        today: body.today,
        blockers: body.blockers || '',
      },
      include: { user: true },
    });

    // Award 5 XP for standup
    await prisma.user.update({
      where: { id: body.userId },
      data: { xp: { increment: 5 } },
    });

    return NextResponse.json(standup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create standup' }, { status: 500 });
  }
}
