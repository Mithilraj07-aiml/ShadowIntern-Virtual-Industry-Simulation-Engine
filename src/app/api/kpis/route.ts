import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const kpis = await prisma.kPI.findMany({
      orderBy: { timestamp: 'asc' },
    });
    return NextResponse.json(kpis);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch KPIs' }, { status: 500 });
  }
}
