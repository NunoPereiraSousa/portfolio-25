export type HighlightMetric = {
  label: string;
  value: string;
};

export const highlightsContent = {
  title: "Some meaningful numbers",
  label:
    "I've worked on everything from award-winning websites to complex SaaS products. Here are a few numbers from along the way.",
  metrics: [
    {
      label: "International design awards and recognitions",
      value: "10+",
    },
    {
      label: "Data rows handled in production SaaS workflows",
      value: "10M+",
    },
    {
      label: "Companies I've worked with worldwide",
      value: "30+",
    },
  ] satisfies HighlightMetric[],
};
