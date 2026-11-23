"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PAYMENT_WINDOW_SECONDS = 15 * 60;

export function PixPaymentTimer() {
  const deadline = useRef<number | null>(null);
  const [remaining, setRemaining] = useState(PAYMENT_WINDOW_SECONDS);

  useEffect(() => {
    deadline.current ??= Date.now() + PAYMENT_WINDOW_SECONDS * 1_000;
    const update = () => {
      const seconds = Math.max(0, Math.ceil((deadline.current! - Date.now()) / 1_000));
      setRemaining(seconds);
      if (seconds === 0) window.clearInterval(interval);
    };
    const interval = window.setInterval(update, 1_000);
    update();
    return () => window.clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div className="mb-7 rounded-xl border border-forest/20 bg-forest/5 px-4 py-4 text-forest sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Clock3 size={18} aria-hidden="true" />
          {remaining > 0 ? "15 minutos para efetuar o pagamento" : "Contagem encerrada"}
        </p>
        <span role="timer" aria-live="off" aria-label={`Tempo restante: ${minutes} minutos e ${seconds} segundos`} className="rounded-lg bg-forest px-3 py-1.5 font-mono text-xl font-semibold tabular-nums text-white">
          {minutes}:{seconds}
        </span>
      </div>
      {remaining === 0 ? (
        <p className="mt-3 text-xs leading-relaxed" role="status">
          Continuamos aguardando a confirmação. O contador não cancela o Pix; antes de pagar, confira sua validade no aplicativo do banco.
        </p>
      ) : null}
    </div>
  );
}
