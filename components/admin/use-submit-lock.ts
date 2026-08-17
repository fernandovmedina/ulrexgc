"use client";

import { useRef, useState } from "react";

export function useSubmitLock() {
  const inFlight = useRef(false);
  const [saving, setSaving] = useState(false);
  const lock = () => { if (inFlight.current) return false; inFlight.current = true; setSaving(true); return true; };
  const unlock = () => { inFlight.current = false; setSaving(false); };
  return { saving, lock, unlock };
}
