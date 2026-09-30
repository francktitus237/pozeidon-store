"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/features/orders/actions";
import type { OrderStatus } from "@/types";

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "preparing", label: "En préparation" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

interface Props {
  orderId: string;
  current: OrderStatus;
}

export function OrderStatusSelect({ orderId, current }: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as OrderStatus;
    startTransition(() => {
      updateOrderStatus(orderId, status);
    });
  }

  return (
    <select
      defaultValue={current}
      onChange={onChange}
      disabled={isPending}
      className="rounded-md border bg-background px-2 py-1 text-xs capitalize outline-none focus:border-sky-500 disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
