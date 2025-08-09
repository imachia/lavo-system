import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ownerId = url.searchParams.get('ownerId');

    const stores = await prisma.store.findMany({
      where: ownerId ? { ownerId: Number(ownerId) } : undefined,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, address: true, createdAt: true, ownerId: true },
    });

    return NextResponse.json({ stores });
  } catch (error: any) {
    console.error('Erro ao listar lojas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar lojas', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, ownerId } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: 'Nome e endereço são obrigatórios' }, 
        { status: 400 }
      );
    }

    let finalOwnerId = ownerId;
    if (!finalOwnerId) {
      // Se não foi fornecido um ownerId, procura o primeiro usuário LOJISTA
      const lojista = await prisma.user.findFirst({
        where: { role: 'LOJISTA' }
      });
      
      if (lojista) {
        finalOwnerId = lojista.id;
      }
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        address,
        ownerId: Number(finalOwnerId)
      }
    });

    return NextResponse.json({ store: newStore });
  } catch (error: any) {
    console.error('Erro ao criar loja:', error);
    return NextResponse.json(
      { error: 'Erro ao criar loja', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
