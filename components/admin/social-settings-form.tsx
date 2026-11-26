"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateSocialConfig,
  detectMetaAccounts,
  type DetectedMetaPage,
} from "@/features/admin/settings-actions";
import type { SocialConfig } from "@/lib/settings";

export function SocialSettingsForm({ config }: { config: SocialConfig }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [token, setToken] = useState(config.metaAccessToken);
  const [pageId, setPageId] = useState(config.facebookPageId);
  const [igId, setIgId] = useState(config.instagramUserId);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState<DetectedMetaPage[] | null>(null);
  const [detectMsg, setDetectMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  function applyPage(p: DetectedMetaPage) {
    // On stocke le token de PAGE (requis pour publier), pas le token utilisateur.
    setToken(p.pageToken);
    setPageId(p.id);
    if (p.instagramUserId) setIgId(p.instagramUserId);
    setDetectMsg({
      ok: true,
      text: `Page « ${p.name} » connectée${
        p.instagramUsername ? ` — Instagram @${p.instagramUsername} détecté` : ""
      } ✓`,
    });
    setDetected(null);
  }

  async function onDetect() {
    setDetecting(true);
    setDetectMsg(null);
    try {
      const res = await detectMetaAccounts(token);
      if (res.error) {
        setDetectMsg({ ok: false, text: res.error });
      } else if (res.pages?.length === 1) {
        applyPage(res.pages[0]);
      } else {
        setDetected(res.pages ?? []);
      }
    } finally {
      setDetecting(false);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateSocialConfig({
        metaAccessToken: token,
        facebookPageId: pageId,
        facebookEnabled: d.get("facebookEnabled") === "on",
        instagramUserId: igId,
        instagramEnabled: d.get("instagramEnabled") === "on",
        facebookUrl: String(d.get("facebookUrl") ?? "").trim(),
        instagramUrl: String(d.get("instagramUrl") ?? "").trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-token" className="text-sm font-medium">
          Token Meta (Graph API Explorer)
        </label>
        <div className="flex gap-2">
          <Input
            id="s-token"
            name="metaAccessToken"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="EAA…"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onDetect}
            disabled={detecting || !token.trim()}
          >
            {detecting ? "Détection…" : "Détecter mes comptes"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Collez votre token puis cliquez « Détecter » : la Page Facebook et le
          compte Instagram relié sont remplis automatiquement.
        </p>
        {detectMsg && (
          <p
            className={`text-xs font-medium ${
              detectMsg.ok ? "text-stock-in" : "text-destructive"
            }`}
          >
            {detectMsg.text}
          </p>
        )}
        {detected && detected.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="s-page-choice" className="text-xs font-medium">
              Plusieurs Pages trouvées — choisissez la vôtre :
            </label>
            <select
              id="s-page-choice"
              className="rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue=""
              onChange={(e) => {
                const p = detected.find((x) => x.id === e.target.value);
                if (p) applyPage(p);
              }}
            >
              <option value="" disabled>
                Choisir une Page…
              </option>
              {detected.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="s-fbid" className="text-sm font-medium">
            ID de la Page Facebook
          </label>
          <Input
            id="s-fbid"
            name="facebookPageId"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            placeholder="Rempli automatiquement"
          />
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="facebookEnabled"
              defaultChecked={config.facebookEnabled}
            />
            Publier sur Facebook
          </label>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="s-igid" className="text-sm font-medium">
            ID du compte Instagram Business
          </label>
          <Input
            id="s-igid"
            name="instagramUserId"
            value={igId}
            onChange={(e) => setIgId(e.target.value)}
            placeholder="Rempli automatiquement"
          />
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="instagramEnabled"
              defaultChecked={config.instagramEnabled}
            />
            Publier sur Instagram
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="s-fburl" className="text-sm font-medium">
            URL de votre Page Facebook
          </label>
          <Input
            id="s-fburl"
            name="facebookUrl"
            type="url"
            defaultValue={config.facebookUrl}
            placeholder="https://facebook.com/votre-page"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="s-igurl" className="text-sm font-medium">
            URL de votre profil Instagram
          </label>
          <Input
            id="s-igurl"
            name="instagramUrl"
            type="url"
            defaultValue={config.instagramUrl}
            placeholder="https://instagram.com/votre-compte"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Ces liens affichent les icônes Facebook/Instagram dans le pied de page
        du site — les visiteurs cliquent et rejoignent vos profils.
      </p>

      <p className="rounded-md bg-sky-50 p-3 text-xs leading-relaxed text-sky-900">
        <strong>Comment obtenir le token (gratuit) :</strong> créez un compte
        sur <strong>Meta for Developers</strong> → créez une appli → ouvrez le{" "}
        <strong>Graph API Explorer</strong> → « Generate Access Token » avec les
        permissions{" "}
        <code className="rounded bg-muted px-1">pages_manage_posts</code> et{" "}
        <code className="rounded bg-muted px-1">
          instagram_content_publish
        </code>{" "}
        → collez-le ici et cliquez « Détecter ». Prérequis : une Page Facebook
        pro et un compte Instagram Pro/Créateur relié à cette Page.
      </p>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {saved && <span className="text-sm text-stock-in">Enregistré ✓</span>}
      </div>
    </form>
  );
}
