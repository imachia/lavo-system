import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');

    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const where: any = { createdAt: { gte: since } };
    
    if (storeId) {
      const storeIdNum = Number(storeId);
      if (isNaN(storeIdNum)) {
        throw new Error('ID da loja inválido');
      }
      where.storeId = storeIdNum;
    }

    const accesses = await prisma.faceAccess.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        storeId: true, 
        deviceId: true, 
        capturedImageUrl: true, 
        createdAt: true,
        customer: {
          select: {
            name: true,
            imageUrl: true
          }
        }
      },
    });

    return NextResponse.json({ 
      accesses,
      count: accesses.length,
      since: since.toISOString()
    });
  } catch (error) {
    console.error('Error fetching accesses:', error);
    return NextResponse.json({ 
      error: 'Erro ao listar acessos',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { 
      status: 500 
    });
  }
}
