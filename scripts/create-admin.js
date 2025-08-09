const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar se já existe um usuário admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADM' }
    });

    if (existingAdmin) {
      console.log('Usuário administrador já existe!');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Criar usuário admin
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@lavo.com',
        password: hashedPassword,
        role: 'ADM',
      },
    });

    console.log('Usuário administrador criado com sucesso!');
    console.log('Email: admin@lavo.com');
    console.log('Senha: admin123');
    console.log('ID:', adminUser.id);

  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();


