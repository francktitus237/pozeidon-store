import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-navy-900">
          Espace de gestion
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Connexion réservée à l&apos;administrateur
        </p>
        {/* Suspense requis pour useSearchParams dans LoginForm */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
