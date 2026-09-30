"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Rechercher un câble, un support, un onduleur…",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/boutique?q=${encodeURIComponent(query)}` : "/boutique");
  }

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher un produit"
        className="w-full rounded-full border bg-sky-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-sky-500 focus:bg-background"
      />
    </form>
  );
}
