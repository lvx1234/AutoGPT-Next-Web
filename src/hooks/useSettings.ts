import { useState } from "react";
import type { ModelSettings } from "../utils/types";
import {
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_LOOPS_FREE,
  GPT_35_TURBO,
} from "../utils/constants";
import { useGuestMode } from "./useGuestMode"

const SETTINGS_KEY = "AGENTGPT_SETTINGS";
const DEFAULT_SETTINGS: ModelSettings = {
  customApiKey: "",
  customModelName: GPT_35_TURBO,
  customTemperature: 0.9,
  customMaxLoops: DEFAULT_MAX_LOOPS_FREE,
  customLanguage: "",
  maxTokens: 400,
  guestKey:""
};

const loadSettings = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    return DEFAULT_SETTINGS;
  }

  try {
    const obj = JSON.parse(data) as ModelSettings;
    Object.entries(obj).forEach(([key, value]) => {
      if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
        // @ts-ignore
        DEFAULT_SETTINGS[key] = value;
      }
    });
  } catch (error) {}

  if (
    DEFAULT_SETTINGS.customApiKey &&
    DEFAULT_SETTINGS.customMaxLoops === DEFAULT_MAX_LOOPS_FREE
  ) {
    DEFAULT_SETTINGS.customMaxLoops = DEFAULT_MAX_LOOPS_CUSTOM_API_KEY;
  }

  return DEFAULT_SETTINGS;
};

export function useSettings({ customLanguage }: { customLanguage: string }) {
  const [settings, setSettings] = useState<ModelSettings>(loadSettings);
  const { isValidGuest } = useGuestMode(settings.guestKey);

  const rewriteSettings = (settings: ModelSettings) => {
    const rewriteSettings = {
      ...settings,
      customLanguage,
      isValidGuest
    };

    return rewriteSettings;
  };

  const saveSettings = (settings: ModelSettings) => {
    setSettings(rewriteSettings(settings));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  return {
    settings,
    saveSettings,
  };
}
