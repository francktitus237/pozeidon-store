"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT } from "@/lib/constants";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = encodeURIComponent(
      `Nom : ${data.get("name")}\nTéléphone : ${data.get("phone")}\n\n${data.get("message")}`
    );
    // En attendant le backend : ouvre WhatsApp avec le message pré-rempli
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Nom complet
          </label>
          <Input id="name" name="name" required placeholder="Votre nom" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Téléphone / WhatsApp
          </label>
          <Input
            id="phone"
            name="phone"
            required
            placeholder="6XX XX XX XX"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Sujet
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Question sur un produit, installation…"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Décrivez votre besoin…"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
      </div>
      {sent && (
        <p className="rounded-md bg-whatsapp-500/10 px-3 py-2 text-sm text-whatsapp-500">
          Message préparé — WhatsApp s&apos;est ouvert dans un nouvel onglet.
        </p>
      )}
      <Button
        type="submit"
        className="bg-navy-900 text-white hover:bg-navy-700"
      >
        Envoyer via WhatsApp
      </Button>
    </form>
  );
}
