import { PrismaClient } from '@prisma/client';
import type { User } from '../types';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lavo.com' },
    update: {},
    create: { name: 'Administrador', email: 'admin@lavo.com', password: await bcrypt.hash('admin123', 12), role: 'ADM' as Role },
  });
  const lojista = await prisma.user.upsert({
    where: { email: 'lojista@lavo.com' },
    update: {},
    create: { name: 'Lojista Demo', email: 'lojista@lavo.com', password: await bcrypt.hash('demo123', 12), role: 'LOJISTA' as Role },
  });
  const tecnico = await prisma.user.upsert({
    where: { email: 'tecnico@lavo.com' },
    update: {},
    create: { name: 'Técnico Demo', email: 'tecnico@lavo.com', password: await bcrypt.hash('demo123', 12), role: 'TECNICO' as Role },
  });

  // stores
  const storeA = await prisma.store.create({ data: { name: 'Loja Centro', address: 'Rua A, 100', ownerId: lojista.id } });
  const storeB = await prisma.store.create({ data: { name: 'Loja Norte', address: 'Av. B, 200', ownerId: lojista.id } });

  // devices (alguns desvinculados)
  const d1 = await prisma.device.create({ data: { label: 'Entrada Principal', doorName: 'Porta 1', serialNumber: 'SN-1001', status: 'ACTIVE' as DeviceStatus, storeId: storeA.id } });
  const d2 = await prisma.device.create({ data: { label: 'Entrada Lateral', doorName: 'Porta 2', serialNumber: 'SN-1002', status: 'ACTIVE' as DeviceStatus, storeId: storeA.id } });
  const d3 = await prisma.device.create({ data: { label: 'Entrada Única', doorName: 'Porta 1', serialNumber: 'SN-2001', status: 'ACTIVE' as DeviceStatus, storeId: storeB.id } });
  const dFree1 = await prisma.device.create({ data: { label: 'Dispositivo Livre 1', doorName: 'Porta X', serialNumber: 'SN-FREE-01', status: 'INACTIVE' as DeviceStatus } });
  const dFree2 = await prisma.device.create({ data: { label: 'Dispositivo Livre 2', doorName: 'Porta Y', serialNumber: 'SN-FREE-02', status: 'INACTIVE' as DeviceStatus } });

  // customers
  const c1 = await prisma.customer.create({ data: { storeId: storeA.id, name: 'João Silva', email: 'joao@cliente.com', phone: '11999990000', imageUrl: 'https://picsum.photos/seed/joao/200' } });
  const c2 = await prisma.customer.create({ data: { storeId: storeA.id, name: 'Maria Souza', email: 'maria@cliente.com', phone: '11988887777', imageUrl: 'https://picsum.photos/seed/maria/200' } });
  const c3 = await prisma.customer.create({ data: { storeId: storeB.id, name: 'Pedro Alves', email: 'pedro@cliente.com', phone: '11977776666', imageUrl: 'https://picsum.photos/seed/pedro/200' } });

  // accesses (últimas 24h)
  const now = new Date();
  for (let i = 0; i < 48; i++) {
    const d = new Date(now.getTime() - Math.floor(Math.random() * 24) * 3600000);
    await prisma.faceAccess.create({
      data: {
        storeId: Math.random() > 0.5 ? storeA.id : storeB.id,
        deviceId: [d1.id, d2.id, d3.id][Math.floor(Math.random() * 3)],
        customerId: [c1.id, c2.id, c3.id][Math.floor(Math.random() * 3)],
        capturedImageUrl: `https://picsum.photos/seed/access${i}/200`,
        confidence: Math.round(Math.random() * 100) / 100,
        createdAt: d,
      },
    });
  }

  await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: { systemName: 'Lavo Access', logoUrl: 'https://picsum.photos/seed/logo/120' },
    create: { id: 1, systemName: 'Lavo Access', logoUrl: 'https://picsum.photos/seed/logo/120' },
  });

  console.log('Seed concluído.');
}

main().finally(async () => prisma.$disconnect());



