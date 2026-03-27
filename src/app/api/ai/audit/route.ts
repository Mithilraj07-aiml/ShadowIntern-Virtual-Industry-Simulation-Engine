import { generateShadowAudit } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const audit = await generateShadowAudit({
      xp: body.xp,
      level: body.level,
      ticketsDone: body.ticketsDone,
      standups: body.standups,
      daysActive: body.daysActive,
    });
    return NextResponse.json({ audit });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate audit' }, { status: 500 });
  }
}
