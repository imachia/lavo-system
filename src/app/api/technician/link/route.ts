import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serialNumber, storeId } = body as { serialNumber: string; storeId: number };

    if (!serialNumber || !storeId) return NextResponse.json({ error: 'serialNumber e storeId são obrigatórios' }, { status: 400 });

    const device = await prisma.device.findUnique({ where: { serialNumber } });
    if (!device) return NextResponse.json({ error: 'Dispositivo não encontrado' }, { status: 404 });
    if (device.storeId) return NextResponse.json({ error: 'Dispositivo já vinculado a uma loja' }, { status: 400 });

    const updated = await prisma.device.update({ where: { id: device.id }, data: { storeId: Number(storeId), status: 'ACTIVE' } });
    return NextResponse.json({ device: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao vincular dispositivo' }, { status: 500 });
  }
}



