# Lavo System

Sistema de gerenciamento para lavanderias desenvolvido com Next.js, TypeScript, TailwindCSS, Prisma e PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **Prisma** - ORM para PostgreSQL
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd lavo-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Crie um banco PostgreSQL
   - Atualize o arquivo `.env` com suas credenciais:
```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
JWT_SECRET="chave_super_secreta"
```

4. **Execute as migrations**
```bash
npx prisma migrate dev --name init
```

5. **Gere o Prisma Client**
```bash
npx prisma generate
```

6. **Crie um usuário administrador**
```bash
node scripts/create-admin.js
```

7. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

## 👤 Usuário Padrão

Após executar o script de criação do admin:
- **Email:** admin@lavo.com
- **Senha:** admin123
- **Role:** ADM

## 🏗️ Estrutura do Projeto

```
lavo-system/
├── app/                    # Páginas Next.js (App Router)
│   ├── api/               # Rotas da API
│   │   └── auth/          # Endpoints de autenticação
│   ├── dashboard/         # Páginas do dashboard
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   └── recover/          # Página de recuperação
├── components/            # Componentes reutilizáveis
│   ├── DashboardLayout.tsx
│   ├── Header.tsx
│   └── Navbar.tsx
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Funções de autenticação
│   ├── auth-store.ts     # Store Zustand
│   └── db.ts             # Configuração Prisma
├── prisma/               # Schema e migrations
├── types/                # Tipos TypeScript
└── scripts/              # Scripts utilitários
```

## 🔐 Sistema de Autenticação

### Roles (Funções)
- **ADM** - Administrador: Acesso completo ao sistema
- **LOJISTA** - Lojista: Acesso às funcionalidades da loja
- **TECNICO** - Técnico: Acesso às funcionalidades técnicas

### Endpoints da API
- `POST /api/auth/register` - Cadastro de usuários
- `POST /api/auth/login` - Login
- `POST /api/auth/recover` - Recuperação de senha
- `POST /api/auth/reset` - Redefinição de senha

## 🎨 Interface

### Design System
- **Cores:** Azul como cor principal (#2563eb)
- **Tipografia:** Inter (padrão Tailwind)
- **Ícones:** Lucide React
- **Layout:** Responsivo com sidebar lateral

### Componentes Principais
- **Navbar:** Menu lateral com navegação
- **Header:** Cabeçalho com informações do usuário
- **DashboardLayout:** Layout base para páginas internas

## 📱 Páginas

### Públicas
- `/` - Página inicial
- `/login` - Login
- `/register` - Cadastro de lojistas
- `/recover` - Recuperação de senha

### Protegidas (Dashboard)
- `/dashboard` - Página principal
- `/dashboard/lojistas` - Gerenciar lojistas (ADM)
- `/dashboard/tecnico` - Painel técnico (TECNICO)
- `/dashboard/configuracoes` - Configurações

## 🔧 Funcionalidades

### Administrador (ADM)
- ✅ Gerenciar usuários
- ✅ Visualizar relatórios
- ✅ Acessar todas as funcionalidades
- ✅ Cadastrar lojistas e técnicos

### Lojista (LOJISTA)
- ✅ Visualizar dashboard da loja
- ✅ Gerenciar pedidos
- ✅ Ver faturamento
- ✅ Configurações pessoais

### Técnico (TECNICO)
- ✅ Gerenciar tarefas técnicas
- ✅ Calendário de manutenções
- ✅ Relatórios de eficiência
- ✅ Configurações pessoais

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outros
- Configure as variáveis de ambiente
- Execute `npm run build`
- Configure o servidor para servir a aplicação

## 🔒 Segurança

- ✅ Hash de senhas com bcrypt
- ✅ JWT com expiração
- ✅ Middleware de autenticação
- ✅ Controle de acesso por role
- ✅ Validação de dados
- ✅ Proteção CSRF

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # Linting
npx prisma studio    # Interface do Prisma
npx prisma migrate   # Executar migrations
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para suporte, entre em contato através dos issues do GitHub.

---

**Desenvolvido com ❤️ para o sistema Lavo**
