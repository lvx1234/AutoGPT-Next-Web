import { useState, useEffect } from "react";
import { env } from "../env/client.mjs";

export function useGuestMode(guestKey = "") {
  const [isValidGuest, setIsValidGuest] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    const publicGuestKey = env.NEXT_PUBLIC_GUEST_KEY ?? "";
    const keys = publicGuestKey.split(",").filter((key) => !!key);
    const isGuestMode = keys.length > 0;
    const isMatchedGuestKey = !!keys.find((key) => key === guestKey);
    const isValidGuest = isMatchedGuestKey;
    setIsValidGuest(isValidGuest);
    setIsGuestMode(isGuestMode);
  }, [guestKey]);

  return {
    isValidGuest,
    isGuestMode,
  };
}
