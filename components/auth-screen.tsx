"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AuthError } from "@supabase/supabase-js";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "signup" | "reset" | "update";

const authMessages: Record<string, string> = {
  email_exists: "Este e-mail já possui uma conta. Entre com sua senha.",
  email_address_invalid: "Digite um endereço de e-mail válido.",
  invalid_credentials: "E-mail ou senha incorretos.",
  over_email_send_rate_limit: "Muitos e-mails enviados. Aguarde alguns minutos e tente novamente.",
  over_request_rate_limit: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  user_already_exists: "Este e-mail já possui uma conta. Entre com sua senha.",
  user_banned: "Esta conta foi desativada.",
  weak_password: "A senha precisa ter pelo menos 6 caracteres.",
};

function getAuthMessage(error: unknown) {
  if (error instanceof AuthError) {
    return authMessages[error.code ?? ""] ?? "Não foi possível concluir. Tente novamente.";
  }
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
}

export function AuthScreen() {
  const {
    configurationError,
    isPasswordRecovery,
    resetPassword,
    signIn,
    signUp,
    updatePassword,
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isPasswordRecovery) setMode("update");
  }, [isPasswordRecovery]);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (mode === "login") await signIn(email.trim(), password);
      if (mode === "signup") await signUp(name, email.trim(), password);
      if (mode === "reset") {
        await resetPassword(email.trim());
        setSuccess("Enviamos o link para redefinir sua senha.");
      }
      if (mode === "update") {
        await updatePassword(password);
        setSuccess("Senha atualizada com sucesso.");
      }
    } catch (authError) {
      setError(getAuthMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    mode === "login"
      ? "Entre na sua conta"
      : mode === "signup"
        ? "Crie sua conta"
        : mode === "reset"
          ? "Recupere sua senha"
          : "Crie uma nova senha";

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-amber-50 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bento</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sua casa, sua despensa, suas escolhas.
            </p>
          </div>
        </div>

        <Card className="p-6 rounded-2xl shadow-lg border-border/70">
          <div className="space-y-1 mb-6">
            {mode === "reset" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-3 mb-2 gap-2"
                onClick={() => changeMode("login")}
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            )}
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {mode === "reset"
                ? "Informe seu e-mail para receber o link de recuperação."
                : mode === "update"
                  ? "Digite a nova senha que deseja usar nos aplicativos Bento."
                  : "Use seu e-mail e sua senha. A Pi Network não é necessária."}
            </p>
          </div>

          {configurationError ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">Autenticação aguardando configuração</p>
              <p className="mt-1">
                Adicione as variáveis do Supabase indicadas no arquivo <code>.env.example</code>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Nome</span>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome"
                      autoComplete="name"
                      className="pl-10"
                      required
                    />
                  </div>
                </label>
              )}

              {mode !== "update" && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">E-mail</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@exemplo.com"
                      autoComplete="email"
                      className="pl-10"
                      required
                    />
                  </div>
                </label>
              )}

              {mode !== "reset" && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Senha</span>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      minLength={6}
                      className="pl-10"
                      required
                    />
                  </div>
                </label>
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              {success && (
                <p role="status" className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-800">
                  {success}
                </p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                {mode === "login"
                  ? "Entrar"
                  : mode === "signup"
                    ? "Criar conta"
                    : mode === "reset"
                      ? "Enviar link"
                      : "Salvar nova senha"}
              </Button>
            </form>
          )}

          {!configurationError && mode === "login" && (
            <div className="mt-5 text-center space-y-2 text-sm">
              <button className="text-primary hover:underline" onClick={() => changeMode("reset")}>
                Esqueci minha senha
              </button>
              <p className="text-muted-foreground">
                Ainda não tem conta?{" "}
                <button className="font-semibold text-primary hover:underline" onClick={() => changeMode("signup")}>
                  Cadastre-se
                </button>
              </p>
            </div>
          )}

          {!configurationError && mode === "signup" && (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <button className="font-semibold text-primary hover:underline" onClick={() => changeMode("login")}>
                Entrar
              </button>
            </p>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Acesso independente de carteira ou criptomoeda.
        </p>
      </div>
    </main>
  );
}
