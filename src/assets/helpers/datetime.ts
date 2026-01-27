import { useEffect, useState } from "react";

function formatLisbonTime(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(d);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = (
    parts.find((p) => p.type === "dayPeriod")?.value ?? ""
  ).toLowerCase(); // am/pm

  // "9.20 pm"
  return `${hour}.${minute} ${dayPeriod}`;
}

export function useLisbonTime() {
  const [time, setTime] = useState(() => formatLisbonTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatLisbonTime(new Date()));
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  return time;
}
