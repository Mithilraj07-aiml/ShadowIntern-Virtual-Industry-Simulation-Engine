import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ticket = await prisma.ticket.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'TODO',
        priority: body.priority || 'MEDIUM',
        xpReward: body.xpReward || 10,
        assigneeId: body.assigneeId,
      },
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    const ticket = await prisma.ticket.update({
      where: { id },
      data,
    });

    // If ticket moved to DONE, award XP
    if (data.status === 'DONE' && ticket.assigneeId) {
      // Check for active chaos events that modify XP
      const chaosEvents = await prisma.chaosEvent.findMany({
        where: { active: true },
      });
      let xpMultiplier = 1;
      chaosEvents.forEach(event => {
        xpMultiplier *= event.xpModifier;
      });

      const xpToAward = Math.round(ticket.xpReward * xpMultiplier);

      await prisma.user.update({
        where: { id: ticket.assigneeId },
        data: { xp: { increment: xpToAward } },
      });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
