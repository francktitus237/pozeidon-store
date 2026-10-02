"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  headers: string[];
  children: React.ReactNode[];
  pageSize?: number;
};

function Controls({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
      </Button>
      <p className="text-sm text-muted-foreground">
        Page {page} / {pageCount}
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        Suivant <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

function usePaged(children: React.ReactNode[], pageSize: number) {
  const [page, setPage] = useState(1);
  const items = Array.isArray(children) ? children : [children];
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pageCount);
  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    pageCount,
    setPage,
  };
}

/** Tableau paginé : `children` = tableau d'éléments <tr> */
export function PaginatedTable({ headers, children, pageSize = 10 }: Props) {
  const { items, page, pageCount, setPage } = usePaged(children, pageSize);
  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </table>
      </div>
      <Controls page={page} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}

/** Liste paginée : `children` = tableau d'éléments <li> */
export function PaginatedUl({ children, pageSize = 10 }: Omit<Props, "headers">) {
  const { items, page, pageCount, setPage } = usePaged(children, pageSize);
  return (
    <ul className="divide-y rounded-lg border bg-card text-sm">
      {items}
      {pageCount > 1 && (
        <li className="px-0 py-0">
          <Controls page={page} pageCount={pageCount} onChange={setPage} />
        </li>
      )}
    </ul>
  );
}
