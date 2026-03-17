import { useLenis } from "./hooks/useLenis";
import { Plus } from "react-bootstrap-icons";
import BarCode from "./assets/images/bar-code.png";
import { GuitarStringsCanvas } from "./components/ShaderBackground";
import { SectionHeader } from "./components/SectionHeader";
import Nuno from "./assets/images/big_me.jpeg";
import HeroImage from "./assets/images/me_header.png";
import LookingDown from "./assets/images/me_car.jpeg";
import { ExpandableResume } from "./components/resume/ExpandableResume";
import { BasicResumeItem } from "./components/resume/BasicResumeItem";
import { ResumeItemText } from "./components/resume/ResumeItemText";
import { useEffect, useMemo, useRef, useState } from "react";
import { Preloader } from "./components/Preloader";
import { useAssetPreload } from "./hooks/useAppPreload";
import { useSplitLinesOnScroll } from "./hooks/useSplitTextHeadings";
import { usePinResume } from "./hooks/usePinResume";
import gsap from "gsap";
import { useScrollLock } from "./hooks/useScrollLock";
import { useLisbonTime } from "./assets/helpers/datetime";
import { useWeatherLabel } from "./hooks/useWeatherLabel";

export default function App() {
  useLenis();
  const [ready, setReady] = useState(false);
  const [splitReady, setSplitReady] = useState(false);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const images = useMemo(() => [BarCode, Nuno, HeroImage, LookingDown], []);
  const { progress, loaded } = useAssetPreload(images);

  useSplitLinesOnScroll(splitReady, pageRef);
  usePinResume(ready);

  // lock while preloader is showing
  useScrollLock(!ready);

  // always start at top on first mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // when preloader finishes, force top again
  useEffect(() => {
    if (!ready) return;
    window.scrollTo(0, 0);
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      setSplitReady(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setSplitReady(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (ready) return;

    const fallbackTimer = window.setTimeout(() => {
      setReady(true);
    }, 4500);

    return () => window.clearTimeout(fallbackTimer);
  }, [ready]);

  // start hidden once (mount)
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0 }); // opacity:0 + visibility:hidden
  }, []);

  // fade in when ready
  useEffect(() => {
    if (!ready) return;
    const el = pageRef.current;
    if (!el) return;

    gsap.to(el, {
      autoAlpha: 1,
      duration: 0.8,
      ease: "power2.out",
      clearProps: "opacity,visibility",
    });
  }, [ready]);

  const lisbonTime = useLisbonTime();
  const { label } = useWeatherLabel("Oporto");

  return (
    <>
      <div>
        {!ready && (
          <Preloader
            progress={progress}
            loaded={loaded}
            startDelayMs={1000}
            endHoldMs={1000}
            onDone={() => setReady(true)}
          />
        )}
        <div className="webgl-desktop-lines">
          <GuitarStringsCanvas
            grid={80}
            step={12}
            threshold={12}
            maxAmp={50}
            dprCap={1.5}
          />
        </div>

        {/* Your real content */}
        <div ref={pageRef}>
          <div className="webgl-mobile-lines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <main className="page">
            <section className="hero">
              <h1>
                <span>The Piiiixel</span>
                <figure className="hero-figure">
                  <img src={HeroImage} alt="" className="hero-image" />
                </figure>
                <span>
                  Perfe©t Chef <sup>ns</sup>
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
                    <p className="hero-info-left-label">WET / Lisbon</p>
                  </div>

                  <div className="hero-info-left-labels">
                    <p className="hero-info-left-title">[current location]</p>
                    <p className="hero-info-left-label">oporto, portugal</p>
                  </div>

                  <div className="hero-info-left-labels">
                    <p className="hero-info-left-title">[weather]</p>
                    <p className="hero-info-left-label">{label}</p>
                  </div>

                  <img src={BarCode} alt="" className="hero-info-left-image" />
                </div>

                <div className="hero-info-right frame">
                  <h3 className="hero-info-right-header">
                    How <span>“</span>Pixel Perfect Chef <sup>ns</sup>
                    <span>”</span> became my thing.
                  </h3>

                  <ul className="hero-info-right-list">
                    <li className="hero-info-right-list-item">
                      <Plus
                        size={24}
                        className="hero-info-right-list-item-icon"
                      />{" "}
                      <p>No glasses, just an eagle eye and pianist hands.</p>
                    </li>
                    <li className="hero-info-right-list-item">
                      <Plus
                        size={24}
                        className="hero-info-right-list-item-icon"
                      />{" "}
                      <p>
                        I hit the right keyboard “notes” and cook interfaces
                        that feel just right.
                      </p>
                    </li>
                    <li className="hero-info-right-list-item">
                      <Plus
                        size={24}
                        className="hero-info-right-list-item-icon"
                      />{" "}
                      <p>
                        And I don't just season the front-end. I cook on the
                        back-end too.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="highlights">
              <h2 className="highlights-header" data-split="lines">
                Some meaningful numbers
              </h2>
              <p className="highlights-label" data-split="lines">
                This is the part where I let the receipts talk. Time in the lab,
                time on the keys, and the exact amount of sugar that makes the
                cake hit.
              </p>

              <div className="highlights-grid">
                <div className="highlights-grid-card">
                  <div className="highlights-grid-card-header-wrapper">
                    <span className="highlights-grid-card-circle"></span>
                    <h5
                      className="highlights-grid-card-header"
                      data-split="lines"
                    >
                      International awards and recognitions
                    </h5>
                  </div>
                  <p className="highlights-grid-card-text">10+</p>
                </div>

                <div className="highlights-grid-card">
                  <div className="highlights-grid-card-header-wrapper">
                    <span className="highlights-grid-card-circle"></span>
                    <h5
                      className="highlights-grid-card-header"
                      data-split="lines"
                    >
                      Teaching and crafting digital experiences
                    </h5>
                  </div>
                  <p className="highlights-grid-card-text">5y+</p>
                </div>

                <div className="highlights-grid-card">
                  <div className="highlights-grid-card-header-wrapper">
                    <span className="highlights-grid-card-circle"></span>
                    <h5
                      className="highlights-grid-card-header"
                      data-split="lines"
                    >
                      Insanely happy clients
                    </h5>
                  </div>
                  <p className="highlights-grid-card-text">80+</p>
                </div>
              </div>
            </section>

            <section className="about">
              <SectionHeader text={"About"} />

              <div className="about-layout">
                <figure className="about-portrait">
                  <img src={Nuno} alt="" className="about-portrait-image" />
                </figure>

                <div className="about-content">
                  <div>
                    <h4 className="about-title" data-split="lines">
                      My name is Nuno, born and raised in the beautiful city of
                      oporto, the best city in Portugal. <br />
                      <span>I hope we are on the same page about this.</span>
                    </h4>
                  </div>

                  <div className="about-facts">
                    <ul className="about-facts-list">
                      <li className="about-facts-item">
                        <Plus size={24} />{" "}
                        <p data-split="lines">Software Engineer.</p>
                      </li>
                      <li className="about-facts-item">
                        <Plus size={24} />{" "}
                        <p data-split="lines">programming teacher.</p>
                      </li>
                      <li className="about-facts-item">
                        <Plus size={24} />{" "}
                        <p data-split="lines">athlete after working hours.</p>
                      </li>
                      <li className="about-facts-item">
                        <Plus size={24} />{" "}
                        <p data-split="lines">pianist on sundays.</p>
                      </li>
                      <li className="about-facts-item">
                        <Plus size={24} />{" "}
                        <p data-split="lines">TRAVELLER, MORE THAN I SHOULD.</p>
                      </li>
                    </ul>
                    <div className="about-facts-arrow">
                      <svg
                        width="142"
                        height="142"
                        viewBox="0 0 142 142"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                    src={LookingDown}
                    alt=""
                    className="about-supporting-image"
                  />
                </figure>
              </div>
            </section>

            <section className="resume">
              <SectionHeader text={"Resume"} />

              <div className="resume-grid">
                <div className="resume-sticky">
                  <svg
                    className="resume-mark"
                    width="783"
                    height="663"
                    viewBox="0 0 783 663"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M350.403 168.826C350.403 262.999 300.895 302.878 226.873 302.878L-3.00859e-06 302.878L-7.62906e-06 250.026L226.873 250.026C280.227 250.026 304.74 223.119 304.74 168.826C304.74 114.052 280.227 87.626 226.873 87.626L-2.18265e-05 87.626L-2.6489e-05 34.2935L226.873 34.2936C300.895 34.2936 350.403 74.1727 350.403 168.826Z"
                      fill="#EF5143"
                    />
                    <path
                      d="M783 168.646C783 271.467 707.536 337.292 604.193 337.292C500.851 337.292 425.867 271.467 425.867 168.646C425.867 65.8249 500.851 2.46663e-05 604.193 1.56318e-05C707.536 6.59728e-06 783 65.8249 783 168.646ZM737.337 168.646C737.337 87.4461 674.851 55.2545 604.193 55.2545C533.536 55.2545 471.53 87.4461 471.53 168.646C471.53 249.846 533.536 282.038 604.193 282.038C674.851 282.038 737.337 249.846 737.337 168.646Z"
                      fill="white"
                    />
                    <path
                      d="M67.4256 663L0 663L2.24008e-05 391L77.233 391L280.736 600.231L281.961 600.231L281.961 391L350 391L350 663L272.767 663L68.6515 453.769L67.4256 453.769L67.4256 663Z"
                      fill="#EF5143"
                    />
                    <path
                      d="M489.93 663L420 663L420 391L500.102 391L711.163 600.231L712.434 600.231L712.434 391L783 391L783 663L702.898 663L491.201 453.769L489.93 453.769L489.93 663Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <div className="resume-list">
                  <div className="resume-list-item">
                    <SectionHeader text={"Resume"} variation="large" />

                    <div className="resume-list-item-list">
                      <ExpandableResume
                        title="Software Engineer, carbmee"
                        date="<span>Promoted</span> March 2025 - Present, Remote"
                        listElements={
                          <ul>
                            <li>
                              Own pixel‑perfect, responsive UI in React +
                              TypeScript (React Query, Tailwind) with high
                              design fidelity, a11y, and performance.
                            </li>
                            <li>
                              Lead evolution of a reusable component/design
                              system; enforce UI consistency via reviews and
                              coding standards.
                            </li>
                            <li>
                              Integrate analytics and lifecycle tools with
                              marketing workflows to improve user engagement and
                              growth outcomes.
                            </li>
                            <li>
                              Plan features with product/design; create tickets,
                              scope work, and write acceptance criteria for
                              predictable delivery.
                            </li>
                            <li>
                              Optimise data‑heavy views and client–server flows;
                              contribute across NestJS and PostgreSQL; integrate
                              FusionAuth.
                            </li>
                            <li>
                              Partner with solution engineers to meet
                              performance & scalability targets on a
                              high‑traffic, carbon‑reduction platform.
                            </li>
                          </ul>
                        }
                      />

                      <ExpandableResume
                        title="Junior Software Engineer, carbmee"
                        date="February 2024 - March 2025"
                        listElements={
                          <ul>
                            <li>
                              Delivered pixel‑perfect, responsive UI in React +
                              TypeScript (React Query, Tailwind) with strong
                              design fidelity, a11y, and performance.
                            </li>
                            <li>
                              Contributed to the component library; collaborated
                              on scoping and acceptance criteria; supported
                              Jenkins/Docker releases and built features with
                              guidance across NestJS + PostgreSQL.
                            </li>
                          </ul>
                        }
                      />

                      <ExpandableResume
                        title="Programming University Teacher, School of Media Arts and Design"
                        date="October 2023 - February 2024 / January 2025 - March 2025"
                        listElements={
                          <ul>
                            <li>
                              Taught web programming to 100+ students
                              (JavaScript, CSS, HTML, Git, Bootstrap).
                            </li>
                            <li>
                              Developed and delivered lectures/workshops;
                              created assignments and exams; provided support
                              and feedback.
                            </li>
                          </ul>
                        }
                      />

                      <ExpandableResume
                        title="Frontend Developer & Web Master, carbmee"
                        date="June 2021 - February 2024"
                        listElements={
                          <ul>
                            <li>
                              Developed and maintained a high‑traffic website
                              for a global carbon‑reduction product, optimised
                              performance, UX, and SEO while collaborating
                              closely with marketing to support campaign goals
                              and customer engagement. Integrated HubSpot CRM
                              for forms, data handling, and email templates.
                            </li>
                            <li>
                              Built responsive, high‑performance interfaces with
                              Next.js, JavaScript, SCSS, GSAP, and Prismic
                              (CMS).
                            </li>
                          </ul>
                        }
                      />

                      <ExpandableResume
                        title="Front-end developer & UI Designer Freelancer"
                        date="June 2021 - October 2023"
                        listElements={
                          <ul>
                            <li>
                              Designed and developed award‑winning websites
                              using React, SCSS, TypeScript/JavaScript, GSAP,
                              Three.js, and Prismic; delivered solutions for the
                              British Government and international clients.
                            </li>
                          </ul>
                        }
                      />
                    </div>
                  </div>

                  <div className="resume-list-item">
                    <SectionHeader
                      text={"awards & recognitions"}
                      variation="large"
                    />

                    <div className="awards-list">
                      <BasicResumeItem text="2x Honorable mention (Awwwards)" />
                      <BasicResumeItem text="1x Mobile excellence award (Awwwards)" />
                      <BasicResumeItem text="1x Website of the day (CSS Design Awards)" />
                      <BasicResumeItem text="2x UI Design award (CSS Design Awards)" />
                      <BasicResumeItem text="2x UX Design award (CSS Design Awards)" />
                      <BasicResumeItem text="2x Innovation Design award (CSS Design Awards)" />
                      <BasicResumeItem text="1x Special Kudos Design award (CSS Design Awards)" />
                      <BasicResumeItem text="1x Valedictorian University student (ESMAD)" />
                      <BasicResumeItem text="3rd best European swimming time, 4x200m freestyle relay (FPN)" />
                      <BasicResumeItem text="5x national swimming titles (CFP)" />
                      <BasicResumeItem text="70x state swimming titles (FCP & CFP)" />
                    </div>
                  </div>

                  <div className="resume-list-item">
                    <SectionHeader
                      text={"Tech Stack / Design & UX"}
                      variation="large"
                    />

                    <div className="awards-list">
                      <BasicResumeItem text="React" />
                      <BasicResumeItem text="TypeScript" />
                      <BasicResumeItem text="Tailwind CSS" />
                      <BasicResumeItem text="React Query" />
                      <BasicResumeItem text="Redux" />
                      <BasicResumeItem text="Next.js" />
                      <BasicResumeItem text="HTML/CSS" />
                      <BasicResumeItem text="Three.js" />
                      <BasicResumeItem text="GSAP" />
                      <BasicResumeItem text="NestJS" />
                      <BasicResumeItem text="Node.js" />
                      <BasicResumeItem text="PostgreSQL/SQL" />
                      <BasicResumeItem text="Docker" />
                      <BasicResumeItem text="Jenkins" />
                      <BasicResumeItem text="Git" />
                      <BasicResumeItem text="Figma" />
                      <BasicResumeItem text="Design systems & component libraries" />
                      <BasicResumeItem text="HubSpot" />
                      <BasicResumeItem text="Prismic" />
                    </div>
                  </div>

                  <div className="resume-list-item">
                    <SectionHeader text={"Expertise"} variation="large" />

                    <div className="awards-list">
                      <BasicResumeItem text="Pixel‑perfect UI" />
                      <BasicResumeItem text="Design systems & reusable components" />
                      <BasicResumeItem text="Performance for data‑heavy views" />
                      <BasicResumeItem text="Accessibility (WCAG 2.1 AA)" />
                      <BasicResumeItem text="Feature planning & ticketing" />
                      <BasicResumeItem text="CI/CD & release reliability" />
                      <BasicResumeItem text="Authentication" />
                      <BasicResumeItem text="Cross‑functional collaboration" />
                    </div>
                  </div>

                  <div className="resume-list-item">
                    <SectionHeader text={"education"} variation="large" />

                    <div className="resume-list-item-list">
                      <ResumeItemText
                        topText="MSc, Communication and Web Technologies — University of Aveiro, 2021-2023 (Aveiro)"
                        bottomText="<span>GPA: 4.5 / 5.</span> Top 1% of students ranking."
                      />
                      <ResumeItemText
                        topText="BSc, Web Information Systems and Technologies — School of Media Arts and Design, 2018–2021 (Porto)"
                        bottomText="<span>Valedictorian student award.</span> GPA: 4.5 / 5.  Student with the highest GPA (top 1%)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className="footer">
              <SectionHeader text={"Contacts"} />

              <h2 className="footer-title" data-split="lines">
                Time to Cook before it's monday
              </h2>

              <p className="footer-label" data-split="lines">
                You made it this far, don’t leave me hanging. Send a message,
                I’m genuinely nice, I promise.
              </p>

              <div className="footer-list">
                <div className="footer-list-item">
                  <span></span>
                  <a href="https://www.linkedin.com/in/nunops" target="_blank">
                    LinkedIn
                  </a>
                  <span></span>
                </div>
                <div className="footer-list-item">
                  <span></span>
                  <a href="mailto:nunopereirasousa00@gmail.com" target="_blank">
                    nunopereirasousa00@gmail.com
                  </a>
                  <span></span>
                </div>
                <div className="footer-list-item">
                  <span></span>
                  <a href="https://github.com/Nunopereirasousa" target="_blank">
                    GitHub
                  </a>
                  <span></span>
                </div>
              </div>

              <div className="footer-svg">
                <div className="footer-svg-mark">
                  <svg
                    viewBox="0 0 1400 374"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M55.3124 366.953H0V7.04711H63.3578L230.301 283.898H231.306V7.04711H287.121V366.953H223.764L56.318 90.1023H55.3124V366.953Z"
                      fill="#EF5143"
                    />
                    <path
                      d="M496.248 374C397.691 374 355.955 322.153 355.955 244.635V7.04711H411.268V244.635C411.268 300.509 439.427 326.18 496.248 326.18C553.571 326.18 581.228 300.509 581.228 244.635V7.04711H637.043V244.635C637.043 322.153 595.307 374 496.248 374Z"
                      fill="#EF5143"
                    />
                    <path
                      d="M761.449 366.953H706.136V7.04711H769.494L936.437 283.898H937.442V7.04711H993.258V366.953H929.9L762.454 90.1023H761.449V366.953Z"
                      fill="#EF5143"
                    />
                    <path
                      d="M1223.5 374C1115.9 374 1047.01 294.972 1047.01 186.748C1047.01 78.5249 1115.9 0 1223.5 0C1331.11 0 1400 78.5249 1400 186.748C1400 294.972 1331.11 374 1223.5 374ZM1223.5 326.18C1308.48 326.18 1342.17 260.743 1342.17 186.748C1342.17 112.754 1308.48 47.8197 1223.5 47.8197C1138.52 47.8197 1104.83 112.754 1104.83 186.748C1104.83 260.743 1138.52 326.18 1223.5 326.18Z"
                      fill="#EF5143"
                    />
                  </svg>
                </div>

                <p className="footer-paragraph">(Yes, that’s my name)</p>

                <p className="footer-paragraph">
                  developed and designed by me with care.
                </p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
