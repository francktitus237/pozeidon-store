"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2, MessageCircle } from "lucide-react";
import {
  askAssistant,
  type ChatTurn,
} from "@/features/assistant/actions";

type Msg = ChatTurn;

const WELCOME: Msg = {
  role: "model",
  text: "Bonjour ! Je suis l'assistant Pozeidon. Posez-moi vos questions sur nos produits, les prix ou la livraison.",
};

export function AiAssistant({ whatsapp }: { whatsapp?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...msgs, { role: "user" as const, text }];
    setMsgs(next);
    setLoading(true);
    const res = await askAssistant(text, next.slice(-10));
    setLoading(false);
    const reply =
      "error" in res && res.error
        ? `Désolé : ${res.error} Vous pouvez aussi nous écrire sur WhatsApp.`
        : (res as { ok: true; text: string }).text;
    setMsgs([...next, { role: "model", text: reply }]);
  }

  return (
    <>
      {/* Bulle flottante, empilée au-dessus du bouton WhatsApp */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Assistant virtuel"
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
      </button>

      {open && (
        <div className="fixed bottom-40 right-5 z-50 flex max-h-[70vh] w-[min(92vw,360px)] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
          {/* En-tête */}
          <div className="flex items-center gap-2.5 bg-navy-900 px-4 py-3 text-white">
            <Bot className="h-5 w-5 text-sky-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Assistant Pozeidon</p>
              <p className="text-[11px] text-sky-200">
                Réponses instantanées sur nos produits
              </p>
            </div>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Continuer sur WhatsApp"
                className="rounded-full bg-whatsapp-500 p-2 hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex min-h-56 flex-1 flex-col gap-2.5 overflow-y-auto bg-sky-50/50 p-3"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end rounded-br-sm bg-navy-900 text-white"
                    : "self-start rounded-bl-sm border bg-white text-navy-900 shadow-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-sm border bg-white px-3.5 py-2.5 text-muted-foreground shadow-sm">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="text-xs">…</span>
              </div>
            )}
          </div>

          {/* Saisie */}
          <div className="flex items-center gap-2 border-t bg-background p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Votre question…"
              maxLength={500}
              className="min-w-0 flex-1 rounded-full border bg-background px-3.5 py-2 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cta-500 text-white transition hover:bg-cta-600 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
