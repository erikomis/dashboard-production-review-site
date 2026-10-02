import { useCallback, useEffect, useState } from "react";

/**
 * Contagem regressiva para o 429 (rate limit): `start(segundos)` bloqueia uma ação até o
 * tempo do Retry-After acabar. `remaining` é 0 quando liberado.
 */
export const useCooldown = () => {
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!until) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) setUntil(0);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [until]);

  const start = useCallback((seconds: number) => {
    const current = Date.now();
    setNow(current);
    setUntil(current + seconds * 1000);
  }, []);

  const remaining = until ? Math.max(0, Math.ceil((until - now) / 1000)) : 0;
  return { remaining, isCoolingDown: remaining > 0, start };
};

/** 75 -> "1:15" */
export const formatCountdown = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
