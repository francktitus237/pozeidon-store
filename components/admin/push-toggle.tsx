"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getVapidPublicKey,
  subscribePush,
  unsubscribePush,
} from "@/features/admin/settings-actions";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

type State = "checking" | "unsupported" | "denied" | "off" | "on";

export function PushToggle() {
  const [state, setState] = useState<State>("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          setState("unsupported");
          return;
        }
        if (Notification.permission === "denied") {
          setState("denied");
          return;
        }
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        setState(sub ? "on" : "off");
      } catch {
        setState("unsupported");
      }
    })();
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const publicKey = await getVapidPublicKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
      const json = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
      await subscribePush(json);
      setState("on");
    } catch {
      setState(Notification.permission === "denied" ? "denied" : "off");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
    } catch {
      setState("on");
    } finally {
      setBusy(false);
    }
  }

  if (state === "unsupported") {
    return (
      <p className="text-sm text-muted-foreground">
        Ce navigateur ne supporte pas les notifications push.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {state === "on" ? (
        <Button variant="outline" onClick={disable} disabled={busy}>
          <BellOff className="mr-2 h-4 w-4" />
          Désactiver sur cet appareil
        </Button>
      ) : (
        <Button
          onClick={enable}
          disabled={busy || state === "denied" || state === "checking"}
          className="bg-navy-900 text-white hover:bg-navy-700"
        >
          <Bell className="mr-2 h-4 w-4" />
          {busy ? "Activation…" : "Activer sur cet appareil"}
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        {state === "on" && (
          <span className="font-medium text-stock-in">
            Notifications actives ✓
          </span>
        )}
        {state === "denied" &&
          "Notifications bloquées par le navigateur — autorisez-les dans les paramètres du site (cadenas dans la barre d'adresse)."}
      </span>
    </div>
  );
}
