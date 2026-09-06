# Bento

Plataforma para organizar compras, despensa e preparo de refeições. O acesso é feito por
e-mail e senha, sem integração ou autenticação da Pi Network.

## Executar localmente

1. O aplicativo já está ligado ao projeto Supabase **Bento-Class-2.0**.
2. Se quiser sobrescrever a configuração, copie `.env.example` para `.env.local`.
3. Execute:

```bash
pnpm install
pnpm dev
```

## Autenticação

- Cadastro com nome, e-mail e senha.
- Login com sessão persistente no navegador.
- Recuperação de senha por e-mail.
- Saída disponível em **Configurações**.
- A mesma conta pode ser usada no Bento Class e no Bento Cozinha.

## Banco de dados

As tabelas do Cozinha usam o prefixo `kitchen_`, preservando as tabelas do Bento Class.
Cada usuário acessa apenas os próprios dados por meio de Row Level Security (RLS).
O SQL reproduzível está em `supabase/migrations`.

O arquivo `.env.local` não deve ser enviado ao GitHub.
