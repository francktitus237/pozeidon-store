// Service worker — notifications push des nouvelles commandes admin.
// Reçoit les push envoyés par lib/push.ts, affiche une notification système.

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Pozeidon Store", {
      body: data.body || "",
      icon: "/logo-mark.png",
      badge: "/logo-mark.png",
      data: { url: data.url || "/gestion/commandes" },
    })
  );
});

// Présence d'un listener fetch requise par Chrome pour rendre le site
// installable (PWA). Aucune mise en cache — le réseau fait tout.
self.addEventListener("fetch", () => {});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/gestion/commandes";
  event.waitUntil(clients.openWindow(url));
});
