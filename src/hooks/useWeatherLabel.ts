import { useEffect, useMemo, useState } from "react";
import { featureFlags } from "@/config/featureFlags";

type WeatherState = {
  label: string;
  tempC?: number;
  isLoading: boolean;
  error?: string;
};

type WeatherResponse = {
  current_weather?: {
    temperature?: number;
    weathercode?: number;
  };
};

function weatherCodeToLabel(code: number): string {
  // WMO interpretation codes (Open-Meteo uses these)
  // 0 clear, 1-3 clouds, 45-48 fog, 51-57 drizzle, 61-67 rain, 71-77 snow, 80-82 showers, 95-99 thunderstorm
  if (code === 0) return "sunny";
  if ([1, 2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  if ([80, 81, 82].includes(code)) return "rainy";
  if ([95, 96, 99].includes(code)) return "stormy";
  return "unknown";
}

const knownWeatherLocations = {
  porto: { lat: 41.1496, lon: -8.6109 },
  oporto: { lat: 41.1496, lon: -8.6109 },
} as const;

function getWeatherLocation(cityKey: string) {
  return knownWeatherLocations[
    cityKey as keyof typeof knownWeatherLocations
  ] ?? knownWeatherLocations.porto;
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchCurrentWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe%2FLisbon`;
  const res = await fetchWithTimeout(url, 3500);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return (await res.json()) as WeatherResponse;
}

export function useWeatherLabel(city = "Porto") {
  const [state, setState] = useState<WeatherState>({
    label: featureFlags.weather ? "..." : "unknown",
    isLoading: featureFlags.weather,
  });

  const cityKey = useMemo(() => city.trim().toLowerCase(), [city]);

  useEffect(() => {
    if (!featureFlags.weather) return;

    let alive = true;

    async function run() {
      try {
        setState({ label: "...", isLoading: true });

        const { lat, lon } = getWeatherLocation(cityKey);
        const data = await fetchCurrentWeather(lat, lon);

        const cw = data?.current_weather;
        const code = cw?.weathercode as number | undefined;
        const tempC =
          typeof cw?.temperature === "number"
            ? (cw.temperature as number)
            : undefined;

        const label =
          typeof code === "number" ? weatherCodeToLabel(code) : "unknown";

        if (!alive) return;
        setState({ label, tempC, isLoading: false });
      } catch (error: unknown) {
        if (!alive) return;
        const message =
          error instanceof Error ? error.message : "Weather error";

        setState({
          label: "unknown",
          isLoading: false,
          error: message,
        });
      }
    }

    run();

    // refresh every 10 minutes
    const id = window.setInterval(run, 10 * 60 * 1000);

    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [cityKey]);

  return state;
}
