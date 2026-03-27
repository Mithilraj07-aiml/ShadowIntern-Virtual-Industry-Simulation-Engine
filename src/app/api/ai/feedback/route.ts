import { generateTicketFeedback } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const feedback = await generateTicketFeedback(body.title, body.description);
    return NextResponse.json({ feedback });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
