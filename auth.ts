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
      authorize(credentials) {
        const ok =
          credentials?.username === ADMIN_USERNAME &&
          credentials?.password === ADMIN_PASSWORD;
        if (!ok) return null;
        // TODO prod : comparer un hash bcrypt plutôt que le mot de passe en clair
        return { id: "admin", name: "Administrateur" };
      },
    }),
  ],
  pages: {
    signIn: "/connexion",
  },
  session: { strategy: "jwt" },
});
