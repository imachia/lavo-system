import { prisma } from '../src/lib/db';
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        // Ler o arquivo SQL
        const sql = fs.readFileSync(path.join(__dirname, 'create-customer-status.sql'), 'utf8');
        
        // Executar o SQL
        await prisma.$executeRawUnsafe(sql);
        
        console.log('Enum CustomerStatus criado com sucesso!');
        
        // Verificar se foi criado
        const result = await prisma.$queryRaw`
            SELECT t.typname, e.enumlabel
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'customerstatus';
        `;
        
        console.log('Valores do enum:', result);
        
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
