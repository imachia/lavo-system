import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    console.log('Iniciando busca de lojas');
    const url = new URL(request.url);
    const ownerId = url.searchParams.get('ownerId');
    
    console.log('Parâmetros:', { ownerId });

    // Garantir que a conexão está inicializada
    try {
      await prisma.$connect();
      console.log('Conexão com o banco estabelecida');
    } catch (error) {
      console.error('Erro ao conectar com o banco:', error);
      return NextResponse.json({ error: 'Erro de conexão com o banco de dados', stores: [] }, { status: 500 });
    }

    // Buscar lojas com try/catch específico
    let stores;
    try {
      stores = await prisma.store.findMany({
        where: ownerId ? { ownerId: Number(ownerId) } : undefined,
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true, 
          name: true, 
          address: true, 
          createdAt: true, 
          ownerId: true 
        },
      });
      console.log(`${stores.length} lojas encontradas`);
    } catch (queryError) {
      console.error('Erro na query:', queryError);
      return NextResponse.json({ 
        error: 'Erro ao buscar lojas no banco de dados',
        details: queryError instanceof Error ? queryError.message : 'Unknown error',
        stores: []
      }, { status: 500 });
    }

    return NextResponse.json({ stores: stores || [] });
  } catch (error: any) {
    console.error('Erro ao listar lojas:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao listar lojas',
        details: error.message,
        stores: [] 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, ownerId: rawOwnerId } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: 'Nome e endereço são obrigatórios' },
        { status: 400 }
      );
    }

    // Determinar o ownerId
    let finalOwnerId = rawOwnerId ? Number(rawOwnerId) : null;

    if (!finalOwnerId) {
      const lojista = await prisma.user.findFirst({
        where: { role: 'LOJISTA' },
        select: { id: true }
      });

      if (!lojista) {
        return NextResponse.json(
          { error: 'Nenhum lojista encontrado para ser proprietário' },
          { status: 400 }
        );
      }
      
      finalOwnerId = lojista.id;
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        address,
        ownerId: finalOwnerId
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



