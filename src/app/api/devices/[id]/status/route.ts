import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const { status } = body as { status: 'ACTIVE' | 'INACTIVE' };
    const updated = await prisma.device.update({ where: { id }, data: { status } });
    return NextResponse.json({ device: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 });
  }
}



