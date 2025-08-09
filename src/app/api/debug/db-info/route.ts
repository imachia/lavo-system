import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test query to get table info
    const tableInfo = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        column_default,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Customer'
    `;

    // Test query to get enum info
    const enumInfo = await prisma.$queryRaw`
      SELECT 
        t.typname, 
        e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typname = 'customerstatus'
    `;

    // Test customer creation
    const testCustomer = await prisma.customer.create({
      data: {
        name: "Test Customer",
        storeId: 1,
        imageUrl: "test.jpg",
        status: "NEW"
      }
    });

    // Get the created customer
    const retrievedCustomer = await prisma.customer.findUnique({
      where: { id: testCustomer.id }
    });

    // Clean up test data
    await prisma.customer.delete({
      where: { id: testCustomer.id }
    });

    return NextResponse.json({
      tableInfo,
      enumInfo,
      testCustomer,
      retrievedCustomer
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
