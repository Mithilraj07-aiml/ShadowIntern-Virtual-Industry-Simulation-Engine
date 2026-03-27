import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await prisma.chaosEvent.findMany({
      orderBy: { triggeredAt: 'desc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

const CHAOS_TEMPLATES = [
  {
    type: 'CRUNCH_TIME',
    title: '🔥 Crunch Time Activated!',
    description: 'The deadline just moved up by 2 weeks. All tickets now award 2x XP!',
    xpModifier: 2.0,
  },
  {
    type: 'DEADLINE_CHANGE',
    title: '📅 Deadline Shifted!',
    description: 'Client changed the requirements last minute. All priorities reshuffled.',
    xpModifier: 1.5,
  },
  {
    type: 'SURPRISE_DEMO',
    title: '🎤 Surprise Demo to the CEO!',
    description: 'The CEO wants to see a demo in 30 minutes. Complete your current ticket ASAP!',
    xpModifier: 1.75,
  },
  {
    type: 'SERVER_FIRE',
    title: '🚨 Server Fire!',
    description: 'Production is down! All hands on deck. Bug tickets are now top priority.',
    xpModifier: 2.5,
  },
  {
    type: 'COFFEE_MACHINE_BROKE',
    title: '☕ Coffee Machine Is Down!',
    description: 'Team morale plummets. Productivity drops. Only completing tickets can save us.',
    xpModifier: 0.75,
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Deactivate any currently active events
    await prisma.chaosEvent.updateMany({
      where: { active: true },
      data: { active: false },
    });

    let template;
    if (body.type) {
      template = CHAOS_TEMPLATES.find(t => t.type === body.type);
    }
    if (!template) {
      template = CHAOS_TEMPLATES[Math.floor(Math.random() * CHAOS_TEMPLATES.length)];
    }

    const event = await prisma.chaosEvent.create({
      data: {
        type: template.type,
        title: template.title,
        description: template.description,
        xpModifier: template.xpModifier,
        active: true,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger event' }, { status: 500 });
  }
}
