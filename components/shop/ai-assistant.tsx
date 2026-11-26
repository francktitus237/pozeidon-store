"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2, MessageCircle, Volume2 } from "lucide-react";
import {
  askAssistant,
  speakAssistant,
  type ChatTurn,
} from "@/features/assistant/actions";

type Msg = ChatTurn;

// Enrobe le PCM 16 bits mono de Gemini TTS dans un en-tête WAV jouable.
function pcmToWav(base64: string, sampleRate = 24000): Blob {
  const raw = atob(base64);
  const pcm = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) pcm[i] = raw.charCodeAt(i);
  const header = new ArrayBuffer(44);
  const v = new DataView(header);
  const str = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  v.setUint32(4, 36 + pcm.length, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true); // bloc fmt
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true); // alignement
  v.setUint16(34, 16, true); // bits
  str(36, "data");
  v.setUint32(40, pcm.length, true);
  return new Blob([header, pcm], { type: "audio/wav" });
}

const WELCOME: Msg = {
  role: "model",
  text: "Bonjour ! Je suis l'assistant Pozeidon. Posez-moi vos questions sur nos produits, les prix ou la livraison.",
};

// Questions proposées au premier contact — orientent le client vers
// ce que l'assistant sait vraiment faire.
const SUGGESTIONS = [
  "Quelles sont les nouveautés ?",
  "Quels sont vos meilleurs produits ?",
  "Vous livrez dans quelles villes ?",
  "Comment suivre ma commande ?",
];

export function AiAssistant({ whatsapp }: { whatsapp?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Bulle d'accroche : après 5 s, invite le visiteur à poser sa question.
  // Affichée une seule fois par session, disparaît toute seule au bout de 12 s.
  const dismissHint = () => {
    setHint(false);
    try {
      sessionStorage.setItem("pze-ai-hint", "1");
    } catch {}
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem("pze-ai-hint")) return;
    } catch {}
    const t = setTimeout(() => setHint(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(dismissHint, 12000);
    return () => clearTimeout(t);
  }, [hint]);

  async function send(override?: string) {
    const text = (override ?? input).trim();
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

  async function speak(i: number, text: string) {
    if (speaking !== null) return;
    setSpeaking(i);
    audioRef.current?.pause();
    const res = await speakAssistant(text);
    if ("ok" in res && res.ok && "audio" in res) {
      // gemini-2.5-…-tts renvoie du PCM brut (à enrober en WAV) ;
      // les modèles récents renvoient déjà du WAV.
      const blob = res.mimeType?.includes("wav")
        ? new Blob(
            [Uint8Array.from(atob(res.audio), (c) => c.charCodeAt(0))],
            { type: "audio/wav" }
          )
        : pcmToWav(res.audio);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setSpeaking(null);
      };
      await audio.play().catch(() => setSpeaking(null));
    } else {
      setSpeaking(null);
    }
  }

  return (
    <>
      {/* Bulle flottante, empilée au-dessus du bouton WhatsApp */}
      <button
        type="button"
        onClick={() => {
          dismissHint();
          setOpen(!open);
        }}
        aria-label="Assistant virtuel"
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-105"
      >
        {!open && (
          <span
            aria-hidden
            className="absolute inset-0 motion-safe:animate-ping rounded-full bg-sky-600 opacity-30"
          />
        )}
        {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}

        {/* Accroche qui attire l'oeil vers l'assistant */}
        {hint && !open && (
          <span className="animate-fade-up absolute right-full top-1/2 mr-3 w-56 -translate-y-1/2 rounded-xl rounded-br-sm border bg-white px-3 py-2.5 text-left text-xs font-medium leading-snug text-navy-900 shadow-lg">
            Une question sur nos produits ?<br />
            Je réponds tout de suite 👋
            <span
              aria-hidden
              className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t bg-white"
            />
          </span>
        )}
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
                <span>{m.text}</span>
                {m.role === "model" && (
                  <button
                    type="button"
                    onClick={() => speak(i, m.text)}
                    aria-label="Écouter la réponse"
                    className="ml-1.5 inline-flex translate-y-0.5 text-sky-600 hover:text-sky-800 disabled:opacity-40"
                    disabled={speaking !== null && speaking !== i}
                  >
                    {speaking === i ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            ))}
            {/* Suggestions au premier échange */}
            {msgs.length === 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:border-sky-500 hover:bg-sky-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-sm border bg-white px-3.5 py-3 text-muted-foreground shadow-sm">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Saisie */}
          <div className="flex items-center gap-2 border-t bg-background p-2.5">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Votre question…"
              maxLength={500}
              className="min-w-0 flex-1 rounded-full border bg-background px-3.5 py-2 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={() => send()}
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
