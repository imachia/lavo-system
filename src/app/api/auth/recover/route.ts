import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, não informar se o email existe ou não
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação'
      });
    }

    // Gerar token de recuperação (expira em 1 hora)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Em produção, aqui você enviaria um email
    // Por enquanto, vamos apenas logar o token
    console.log('Token de recuperação para', email, ':', resetToken);

    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação'
    });

  } catch (error) {
    console.error('Erro na recuperação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
