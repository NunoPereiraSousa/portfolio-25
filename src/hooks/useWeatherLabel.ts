import { useEffect, useMemo, useState } from "react";

type WeatherState = {
  label: string;
  tempC?: number;
  isLoading: boolean;
  error?: string;
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

async function geocodeCity(name: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name,
  )}&count=1&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to geocode city");
  const data = await res.json();

  const first = data?.results?.[0];
  if (!first) throw new Error("City not found");

  return { lat: first.latitude as number, lon: first.longitude as number };
}

async function fetchCurrentWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Europe%2FLisbon`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export function useWeatherLabel(city = "Porto") {
  const [state, setState] = useState<WeatherState>({
    label: "…",
    isLoading: true,
  });

  const cityKey = useMemo(() => city.trim().toLowerCase(), [city]);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setState({ label: "…", isLoading: true });

        const { lat, lon } = await geocodeCity(cityKey);
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
      } catch (e: any) {
        if (!alive) return;
        setState({
          label: "unknown",
          isLoading: false,
          error: e?.message ?? "Weather error",
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
