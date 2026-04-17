import { useState, useEffect } from "react";

const RESEND_COOLDOWN = 60;

export function useResendCooldown() {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
  }

  return { cooldown, startCooldown };
}
