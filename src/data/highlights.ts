export type HighlightMetric = {
  label: string;
  value: string;
};

export const highlightsContent = {
  title: "Some meaningful numbers",
  label:
    "This is the part where I let the receipts talk. Time in the lab, time on the keys, and the exact amount of sugar that makes the cake hit.",
  metrics: [
    {
      label: "International awards and recognitions",
      value: "10+",
    },
    {
      label: "Teaching and crafting digital experiences",
      value: "5y+",
    },
    {
      label: "Insanely happy clients",
      value: "80+",
    },
  ] satisfies HighlightMetric[],
};
