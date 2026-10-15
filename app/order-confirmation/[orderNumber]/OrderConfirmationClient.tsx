"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cartContext";

interface OrderConfirmationClientProps {
  orderNumber: string;
}

export function OrderConfirmationClient({ orderNumber }: OrderConfirmationClientProps) {
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!clearedRef.current && orderNumber) {
      clearCart();
      clearedRef.current = true;
    }
  }, [clearCart, orderNumber]);

  return null;
}
