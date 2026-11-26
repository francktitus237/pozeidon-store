"use client";

import { useEffect } from "react";

// Enregistre le service worker pour tous les visiteurs : rend le site
// installable (PWA) et permet les notifications push quand l'admin
// s'abonne depuis Réglages.
export function SwRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
