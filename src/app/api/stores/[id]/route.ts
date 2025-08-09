import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const { name, address } = body as { name?: string; address?: string };

    const updated = await prisma.store.update({ where: { id }, data: { name, address } });
    return NextResponse.json({ store: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar loja' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const storeId = Number(params.id);

    // Delete all related data first in a transaction
    await prisma.$transaction([
      prisma.faceAccess.deleteMany({ where: { storeId } }),
      prisma.customer.deleteMany({ where: { storeId } }),
      prisma.device.deleteMany({ where: { storeId } }),
      prisma.store.delete({ where: { id: storeId } })
    ]);

    return NextResponse.json({ message: 'Loja deletada com sucesso' });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar loja' },
      { status: 500 }
    );
  }
}



