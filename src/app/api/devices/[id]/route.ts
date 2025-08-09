import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    console.log('Dados recebidos:', body);

    const { label, doorName, serialNumber, status, storeId } = body as { 
      label?: string; 
      doorName?: string; 
      serialNumber?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      storeId?: number | null;
    };

    try {
      const updated = await prisma.device.update({ 
        where: { id }, 
        data: { 
          ...(label !== undefined && { label }),
          ...(doorName !== undefined && { doorName }),
          ...(serialNumber !== undefined && { serialNumber }),
          ...(status !== undefined && { status }),
          storeId: storeId === undefined ? undefined : storeId
        },
        include: {
          store: {
            select: {
              name: true
            }
          }
        }
      });

      console.log('Dispositivo atualizado:', updated);
      return NextResponse.json({ device: updated });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      return NextResponse.json({ error: 'Erro ao atualizar dispositivo', details: error }, { status: 500 });
    }
    return NextResponse.json({ device: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar dispositivo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    
    // Delete in transaction to ensure all related data is removed
    await prisma.$transaction([
      prisma.faceAccess.deleteMany({ where: { deviceId: id } }),
      prisma.device.delete({ where: { id } })
    ]);

    return NextResponse.json({ message: 'Dispositivo deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar dispositivo' },
      { status: 500 }
    );
  }
}



