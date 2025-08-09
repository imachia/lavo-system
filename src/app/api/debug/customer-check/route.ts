import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Verificar o enum
    const enumCheck = await prisma.$queryRaw`
      SELECT t.typname, e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'customerstatus'
    `;

    // Verificar a estrutura da tabela
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Customer'
    `;

    // Tentar buscar um cliente
    const customers = await prisma.customer.findMany({
      take: 1
    });

    return NextResponse.json({
      enumCheck,
      tableInfo,
      customers
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: error
    }, { status: 500 });
  }
}
