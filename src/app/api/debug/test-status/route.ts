import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test direct SQL update
    await prisma.$executeRaw`
      UPDATE "Customer" 
      SET status = 'ACTIVE'::CustomerStatus 
      WHERE id = 1
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
