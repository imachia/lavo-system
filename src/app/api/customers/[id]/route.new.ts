import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CustomerStatus } from '@prisma/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = await request.json();
    
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        imageUrl: data.imageUrl,
        status: data.status as CustomerStatus
      }
    });

    return NextResponse.json({ customer });
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
