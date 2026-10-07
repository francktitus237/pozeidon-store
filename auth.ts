import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Identifiants admin définis dans .env.local :
//   ADMIN_USERNAME=admin
//   ADMIN_PASSWORD=mot-de-passe-fort
//   AUTH_SECRET=...  (générer avec : npx auth secret)

// Fallback dev si les variables ne sont pas définies
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Identifiant" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "");
        const password = String(credentials?.password ?? "");
        if (!username || !password) return null;

        // Compte principal : variables d'environnement
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          return { id: "admin", name: ADMIN_USERNAME };
        }

        // Comptes supplémentaires gérés dans Réglages → Comptes admin
        const { findAdminUser } = await import("@/lib/settings");
        const { verifyPassword } = await import("@/lib/admin-auth");
        const user = await findAdminUser(username);
        if (user && verifyPassword(password, user.passwordHash)) {
          return { id: user.id, name: user.username };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/connexion",
  },
  session: { strategy: "jwt" },
});
