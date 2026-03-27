import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const user = users[0];
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    const ticketsDone = await prisma.ticket.count({
      where: { status: 'DONE', assigneeId: user.id },
    });
    const totalTickets = await prisma.ticket.count({
      where: { assigneeId: user.id },
    });
    const standupsCount = await prisma.standup.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      ...user,
      ticketsDone,
      totalTickets,
      standupsCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
