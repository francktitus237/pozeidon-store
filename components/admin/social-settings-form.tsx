"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSocialConfig } from "@/features/admin/settings-actions";
import type { SocialConfig } from "@/lib/settings";

export function SocialSettingsForm({ config }: { config: SocialConfig }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateSocialConfig({
        metaAccessToken: String(d.get("metaAccessToken") ?? "").trim(),
        facebookPageId: String(d.get("facebookPageId") ?? "").trim(),
        facebookEnabled: d.get("facebookEnabled") === "on",
        instagramUserId: String(d.get("instagramUserId") ?? "").trim(),
        instagramEnabled: d.get("instagramEnabled") === "on",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-token" className="text-sm font-medium">
          Token d&apos;accès Meta (Page Access Token)
        </label>
        <Input
          id="s-token"
          name="metaAccessToken"
          type="password"
          autoComplete="off"
          defaultValue={config.metaAccessToken}
          placeholder="EAA…"
        />
        <p className="text-xs text-muted-foreground">
          Token longue durée généré depuis Meta for Developers (Graph API
          Explorer) avec les permissions{" "}
          <code className="rounded bg-muted px-1">pages_manage_posts</code> et{" "}
          <code className="rounded bg-muted px-1">
            instagram_content_publish
          </code>
          . Le même token pilote Facebook et Instagram.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="s-fbid" className="text-sm font-medium">
            ID de la Page Facebook
          </label>
          <Input
            id="s-fbid"
            name="facebookPageId"
            defaultValue={config.facebookPageId}
            placeholder="123456789012345"
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
            defaultValue={config.instagramUserId}
            placeholder="17841400000000000"
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

      <p className="rounded-md bg-sky-50 p-3 text-xs leading-relaxed text-sky-900">
        Prérequis : une <strong>Page Facebook</strong> professionnelle et un
        compte <strong>Instagram Pro/Créateur relié à cette Page</strong>. Une
        fois activés, des cases « Publier sur… » apparaissent dans le
        formulaire article. L&apos;ID de la Page se trouve dans les paramètres
        de la Page (« À propos »), l&apos;ID Instagram via{" "}
        <code className="rounded bg-muted px-1">
          GET /me/accounts?fields=instagram_business_account
        </code>{" "}
        dans le Graph API Explorer.
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
