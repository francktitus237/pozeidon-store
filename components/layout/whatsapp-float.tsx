import { MessageCircle } from "lucide-react";
import { getContact } from "@/lib/settings";

export async function WhatsAppFloat() {
  const contact = await getContact();
  return (
    <a
      href={`https://wa.me/${contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp-500 text-white shadow-lg transition-transform hover:scale-105"
    >
      <span
        aria-hidden
        className="absolute inset-0 motion-safe:animate-ping rounded-full bg-whatsapp-500 opacity-25"
      />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
