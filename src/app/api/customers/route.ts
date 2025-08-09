import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ customers: [] });
    }

    const customers = await prisma.$queryRaw`
      SELECT id, "storeId", name, email, phone, "imageUrl", status, "createdAt"
      FROM "Customer"
      WHERE "storeId" = ${parseInt(storeId)}
      ORDER BY "createdAt" DESC
    `;

    console.log('Clientes encontrados:', customers);
    
    return NextResponse.json({ customers });
  } catch (error: any) {
    console.error('Erro ao listar clientes:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erro ao listar clientes', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, name, email, phone, imageUrl, status } = body as { 
      storeId: number; 
      name: string; 
      email?: string; 
      phone?: string; 
      imageUrl: string;
      status?: 'NEW' | 'ACTIVE' | 'VIP' | 'WARNING' | 'BLOCKED';
    };
    
    if (!storeId || !name || !imageUrl) {
      return NextResponse.json(
        { error: 'storeId, name e imageUrl são obrigatórios' }, 
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({ 
      data: { 
        storeId, 
        name, 
        email, 
        phone, 
        imageUrl,
        status: status || 'NEW'
      },
      include: {
        store: true
      }
    });

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cliente' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



