import { Plus } from "react-bootstrap-icons";
import { appImages } from "@/app/appAssets";
import { SectionHeader } from "@/components/SectionHeader";
import { aboutContent } from "@/data";

export function AboutSection() {
  return (
    <section className="about">
      <SectionHeader text={"About"} />

      <div className="about-layout">
        <figure className="about-portrait">
          <img
            src={appImages.nuno}
            alt="Nuno Pereira Sousa"
            className="about-portrait-image"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="about-content">
          <div>
            <h4 className="about-title" data-split="lines">
              {aboutContent.title} <br />
              <span>{aboutContent.titleAccent}</span>
            </h4>
          </div>

          <div className="about-facts">
            <ul className="about-facts-list">
              {aboutContent.facts.map((fact) => (
                <li className="about-facts-item" key={fact}>
                  <Plus size={24} /> <p data-split="lines">{fact}</p>
                </li>
              ))}
            </ul>
            <div className="about-facts-arrow">
              <svg
                width="142"
                height="142"
                viewBox="0 0 142 142"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="70.7107"
                  width="100"
                  height="100"
                  transform="rotate(45 70.7107 0)"
                />
                <path
                  d="M51.7608 90.3677L49.8394 90.3587L49.8511 92.2774L51.7697 92.2891L51.7608 90.3677ZM49.6871 57.7931L49.8394 90.3587L53.6821 90.3767L53.5299 57.811L49.6871 57.7931ZM51.7697 92.2891L84.3354 92.4413L84.3174 88.5986L51.7518 88.4463L51.7697 92.2891ZM53.124 91.7309L93.6407 51.2142L90.9142 48.4877L50.3975 89.0044L53.124 91.7309Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>

        <figure className="about-supporting-figure">
          <img
            src={appImages.lookingDown}
            alt="Nuno Pereira Sousa leaning out of a car window"
            className="about-supporting-image"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}
