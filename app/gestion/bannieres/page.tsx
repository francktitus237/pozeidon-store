import { redirect } from "next/navigation";

// Ancienne entrée du menu — le contenu du site se gère dans /gestion/contenu
export default function AdminBannersPage() {
  redirect("/gestion/contenu");
}
