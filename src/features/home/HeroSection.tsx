import { Plus } from "react-bootstrap-icons";
import { appImages } from "@/app/appAssets";
import { useLisbonTime } from "@/assets/helpers/datetime";
import { heroContent, heroMeta } from "@/data";
import { useWeatherLabel } from "@/hooks/useWeatherLabel";

export function HeroSection() {
  const lisbonTime = useLisbonTime();
  const { label } = useWeatherLabel("Oporto");

  return (
    <section className="hero">
      <h1>
        <span>{heroContent.eyebrow}</span>
        <figure className="hero-figure">
          <img
            src={appImages.hero}
            alt="Nuno Pereira Sousa portrait"
            className="hero-image"
            decoding="async"
            fetchPriority="high"
          />
        </figure>
        <span>
          {heroContent.title} <sup>{heroContent.titleSup}</sup>
        </span>
      </h1>

      <div className="hero-info">
        <div className="hero-info-left">
          <div className="hero-info-left-labels">
            <p className="hero-info-left-title">[local time]</p>
            <p className="hero-info-left-label">{lisbonTime}</p>
          </div>

          <div className="hero-info-left-labels">
            <p className="hero-info-left-title">[time zone]</p>
            <p className="hero-info-left-label">{heroMeta.timeZone}</p>
          </div>

          <div className="hero-info-left-labels">
            <p className="hero-info-left-title">[current location]</p>
            <p className="hero-info-left-label">{heroMeta.location}</p>
          </div>

          <div className="hero-info-left-labels">
            <p className="hero-info-left-title">[weather]</p>
            <p className="hero-info-left-label">{label}</p>
          </div>

          <img
            src={appImages.barCode}
            alt=""
            className="hero-info-left-image"
            aria-hidden="true"
            decoding="async"
          />
        </div>

        <div className="hero-info-right corner-frame">
          <h3 className="hero-info-right-header">
            How <span>"</span>
            {heroContent.infoTitle} <sup>{heroContent.infoSup}</sup>
            <span>"</span> became my thing.
          </h3>

          <ul className="hero-info-right-list">
            {heroContent.facts.map((fact) => (
              <li className="hero-info-right-list-item" key={fact}>
                <Plus size={24} className="hero-info-right-list-item-icon" />{" "}
                <p>{fact}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
