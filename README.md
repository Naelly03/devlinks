# 🔗 DevLinks

O **DevLinks** é um agregador de links personalizado (estilo Linktree), desenvolvido para centralizar suas redes sociais, portfólio e projetos em uma única página pública, com um painel administrativo completo para gerenciamento de conteúdo.

<img width="1265" height="532" alt="home" src="https://github.com/user-attachments/assets/cca407c7-13ab-4a92-923b-067378148ede" />


## 🚀 Tecnologias

Este projeto foi construído utilizando as tecnologias mais modernas do ecossistema React:

- **[Next.js 16](https://nextjs.org/)** (App Router & Server Actions)
- **[Tailwind CSS](https://tailwindcss.com/)** (Estilização responsiva e tema Clean)
- **[Prisma ORM](https://www.prisma.io/)** (Abstração do Banco de Dados)
- **[Supabase](https://supabase.com/)** (PostgreSQL na nuvem e Autenticação)
- **TypeScript** (Tipagem estática)
- **Vercel** (CI/CD e Hospedagem)

## ✨ Funcionalidades

- **📱 Página de Perfil Pública:**
  - Design limpo e minimalista (Light Mode).
  - **Botões Inteligentes:** O sistema detecta o nome da rede social (LinkedIn, GitHub, Portfolio) e aplica as cores oficiais da marca automaticamente.
  - Layout totalmente responsivo (Mobile First).

- **🔐 Painel Administrativo:**
  - Login seguro via E-mail/Senha (Supabase Auth).
  - Proteção de rotas (Redirecionamento se não estiver logado).

- **⚙️ Gerenciamento Completo (CRUD):**
  - **Adicionar:** Criação rápida de novos links.
  - **Editar:** Atualização de títulos e URLs existentes.
  - **Excluir:** Remoção de links.
  - **Validação:** Adição automática de `https://` para evitar links quebrados.

## 📂 Estrutura do Projeto

```bash
├── app/
│   ├── admin/      # Painel de Controle (Protegido)
│   ├── login/      # Tela de Autenticação
│   ├── actions.ts  # Server Actions (Lógica do Back-end)
│   ├── page.tsx    # Página Pública (Home)
│   └── layout.tsx  # Layout Global
├── lib/
│   └── supabase.ts # Configuração do Cliente Supabase
├── prisma/
│   └── schema.prisma # Modelagem do Banco de Dados
└── public/         # Arquivos estáticos
```

## 🛠️ Como rodar localmente
1. Clone o repositório:
  ```
  git clone [https://github.com/Naelly03/devlinks.git](https://github.com/Naelly03/devlinks.git)
  ```
2. Instale as dependências:
  ```
  npm install
  ```
3. Configure as Variáveis de Ambiente: Crie um arquivo .env na raiz do projeto e preencha com suas credenciais do Supabase:
  ```
  # Banco de Dados (Pode usar SQLite localmente para facilitar)
  DATABASE_URL="file:./dev.db"
  
  # Chaves do Supabase (Project Settings > API)
  NEXT_PUBLIC_SUPABASE_URL="SUA_URL_DO_SUPABASE"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_PUBLIC"
  ```

4. Prepare o Banco de Dados:
  ```
  npx prisma db push
  ```

5. Rode o projeto:
  ```
  npm run dev
  ```
Acesse http://localhost:3000 no seu navegador.


##  Deploy
O projeto está configurado para deploy automático na Vercel. Para produção, lembre-se de alterar o provider do Prisma para postgresql e configurar a DATABASE_URL do Supabase nas Environment Variables da Vercel.

Desenvolvido por Naelly Vitoria
