import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let cfg = await prisma.systemConfig.findFirst();
    if (!cfg) {
      cfg = await prisma.systemConfig.create({ data: { id: 1, systemName: 'Lavo System' } });
    }
    return NextResponse.json(cfg);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configuração' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemName, logoUrl } = body as { systemName?: string; logoUrl?: string | null };

    const updated = await prisma.systemConfig.upsert({
      where: { id: 1 },
      update: { systemName: systemName ?? undefined, logoUrl: logoUrl ?? undefined },
      create: { id: 1, systemName: systemName || 'Lavo System', logoUrl: logoUrl ?? null },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 });
  }
}



