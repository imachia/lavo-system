import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    const onlyFree = url.searchParams.get('free');

    const where: any = {};
    if (storeId) where.storeId = Number(storeId);
    if (onlyFree === 'true') where.storeId = null;

    const devices = await prisma.device.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: 'desc' },
      select: { id: true, label: true, doorName: true, serialNumber: true, status: true, storeId: true },
    });
    return NextResponse.json({ devices });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar dispositivos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, label, doorName, serialNumber, status } = body as { storeId?: number; label: string; doorName: string; serialNumber: string; status?: 'ACTIVE' | 'INACTIVE' };

    const device = await prisma.device.create({ data: { storeId: storeId ?? null, label, doorName, serialNumber, status: (status || 'ACTIVE') as any } });
    return NextResponse.json({ device });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar dispositivo' }, { status: 500 });
  }
}
