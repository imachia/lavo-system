import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CustomerStatus } from '@prisma/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({ error: 'ID do cliente não fornecido' }, { status: 400 });
  }

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID do cliente inválido' }, { status: 400 });
    }

    const data = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'Dados não fornecidos' }, { status: 400 });
    }

    // Validar status antes de atualizar
    if (data.status && !['NEW', 'ACTIVE', 'VIP', 'WARNING', 'BLOCKED'].includes(data.status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.status && { status: data.status as CustomerStatus })
      }
    });

    return NextResponse.json({ customer: updated });
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    await prisma.$transaction([
      prisma.faceAccess.deleteMany({ where: { customerId: id } }),
      prisma.customer.delete({ where: { id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir cliente', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}