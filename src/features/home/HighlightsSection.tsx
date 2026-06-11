import { highlightsContent } from "@/data";

export function HighlightsSection() {
  return (
    <section className="highlights">
      <h2 className="highlights-header" data-split="lines">
        {highlightsContent.title}
      </h2>
      <p className="highlights-label" data-split="lines">
        {highlightsContent.label}
      </p>

      <div className="highlights-grid">
        {highlightsContent.metrics.map((metric) => (
          <div className="highlights-grid-card" key={metric.label}>
            <div className="highlights-grid-card-header-wrapper">
              <span className="highlights-grid-card-circle"></span>
              <h5 className="highlights-grid-card-header" data-split="lines">
                {metric.label}
              </h5>
            </div>
            <p className="highlights-grid-card-text">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
