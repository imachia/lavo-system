import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: number, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

export function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
  } catch {
    return null;
  }
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export async function authenticateUser(request: NextRequest): Promise<{ user: UserData; token: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return { user, token };
}

export function requireAuth(handler: (request: NextRequest, auth: { user: UserData; token: string }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await authenticateUser(request);
    
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(request, auth);
  };
}

export function requireRole(allowedRoles: string[]) {
  return (handler: (request: NextRequest, auth: { user: UserData; token: string }) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      const auth = await authenticateUser(request);
      
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (!allowedRoles.includes(auth.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return handler(request, auth);
    };
  };
}
