# Bento

Plataforma para organizar compras, despensa e preparo de refeições. O acesso é feito por
e-mail e senha, sem integração ou autenticação da Pi Network.

## Executar localmente

1. Crie um projeto no Firebase e registre um aplicativo Web.
2. Em **Authentication > Sign-in method**, habilite **E-mail/senha**.
3. Copie `.env.example` para `.env.local` e preencha os dados do aplicativo Web.
4. Execute:

```bash
pnpm install
pnpm dev
```

## Autenticação

- Cadastro com nome, e-mail e senha.
- Login com sessão persistente no navegador.
- Recuperação de senha por e-mail.
- Saída disponível em **Configurações**.

O arquivo `.env.local` não deve ser enviado ao GitHub.
