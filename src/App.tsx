import { useLenis } from "./hooks/useLenis";
import { Plus } from "react-bootstrap-icons";
import BarCode from "./assets/images/bar-code.png";
import { GuitarStringsCanvas } from "./components/ShaderBackground";
import { SectionHeader } from "./components/SectionHeader";
import Nuno from "./assets/images/portrait.jpeg";
import Hike from "./assets/images/hike.png";
import { ExpandableResume } from "./components/resume/ExpandableResume";
import { BasicResumeItem } from "./components/resume/BasicResumeItem";
import { ResumeItemText } from "./components/resume/ResumeItemText";
// import { FooterMarkBulge } from "./components/FooterMarkWebGL";
import { WireGlobeR3F } from "./components/Globe";
import { useState } from "react";

export default function App() {
  useLenis({ infinite: false });
  const [imgVisible, setImgVisible] = useState(false);

  return (
    <>
      <GuitarStringsCanvas
        grid={80}
        step={12}
        threshold={12}
        maxAmp={50}
        dprCap={1.5}
      />

      <main className="page">
        <section className="hero">
          <h1>
            The Piiiixel Perfe©t Chef <sup>ns</sup>
          </h1>

          <div className="hero-info">
            <div className="hero-info-left">
              <div className="hero-info-left-labels">
                <p className="hero-info-left-title">[local time]</p>
                <p className="hero-info-left-label">9.20 pm</p>
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
                <p className="hero-info-left-label">rainy</p>
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
                  <Plus size={24} className="hero-info-right-list-item-icon" />{" "}
                  <p>No glasses, just an eagle eye and pianist hands.</p>
                </li>
                <li className="hero-info-right-list-item">
                  <Plus size={24} className="hero-info-right-list-item-icon" />{" "}
                  <p>
                    I hit the right keyboard “notes” and cook interfaces that
                    feel just right.
                  </p>
                </li>
                <li className="hero-info-right-list-item">
                  <Plus size={24} className="hero-info-right-list-item-icon" />{" "}
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
          <h2 className="highlights-header">Some meaningful numbers</h2>
          <p className="highlights-label">
            This is the part where I let the receipts talk. Time in the lab,
            time on the keys, and the exact amount of sugar that makes the cake
            hit.
          </p>

          <div className="highlights-grid">
            <div className="highlights-grid-card">
              <div className="highlights-grid-card-header-wrapper">
                <span className="highlights-grid-card-circle"></span>
                <h5 className="highlights-grid-card-header">
                  International awards and recognitions
                </h5>
              </div>
              <p className="highlights-grid-card-text">10+</p>
            </div>

            <div className="highlights-grid-card">
              <div className="highlights-grid-card-header-wrapper">
                <span className="highlights-grid-card-circle"></span>
                <h5 className="highlights-grid-card-header">
                  Teaching and crafting digital experiences
                </h5>
              </div>
              <p className="highlights-grid-card-text">5y+</p>
            </div>

            <div className="highlights-grid-card">
              <div className="highlights-grid-card-header-wrapper">
                <span className="highlights-grid-card-circle"></span>
                <h5 className="highlights-grid-card-header">
                  Insanely happy clients
                </h5>
              </div>
              <p className="highlights-grid-card-text">80+</p>
            </div>
          </div>
        </section>

        <section className="about">
          <div className="about-container">
            <div className="about-left">
              <div>
                <SectionHeader text={"About"} />
                <h4 className="about-header">
                  My name is Nuno, born and raised in the beautiful touristic
                  city of oporto, the best city in Portugal.{" "}
                  <span>I hope we are on the same page about this.</span>
                </h4>
              </div>
              <div className="about-card">
                <ul className="about-card-list">
                  <li className="about-card-list-item">
                    <Plus size={24} className="about-card-icon" />{" "}
                    <p>Software Engineer.</p>
                  </li>
                  <li className="about-card-list-item">
                    <Plus size={24} className="about-card-icon" />{" "}
                    <p>programming teacher.</p>
                  </li>
                  <li className="about-card-list-item">
                    <Plus size={24} className="about-card-icon" />{" "}
                    <p>athlete after working hours.</p>
                  </li>
                  <li className="about-card-list-item">
                    <Plus size={24} className="about-card-icon" />{" "}
                    <p>pianist on sundays.</p>
                  </li>
                  <li className="about-card-list-item">
                    <Plus size={24} className="about-card-icon" />{" "}
                    <p>TRAVELLER, MORE THAN I SHOULD.</p>
                  </li>
                </ul>
                <div className="card-arrow">
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

            <img src={Nuno} alt="" className="about-image" />

            <div className="about-right">
              <div
                className="about-right-card"
                onMouseEnter={() => setImgVisible(true)}
                onMouseLeave={() => setImgVisible(false)}
              >
                {imgVisible ? (
                  <img src={Hike} alt="" className="about-right-card-image" />
                ) : (
                  <>
                    <p className="about-card-right-label">Hover me to reveal</p>
                    <Plus size={24} className="about-right-card-icon" />
                  </>
                )}
              </div>

              <div className="about-right-globes">
                <WireGlobeR3F className="globe-1" speed={0.2} tilt={50} />
              </div>
            </div>
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
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                      </ul>
                    }
                  />

                  <ExpandableResume
                    title="Programming University Teacher, School of Media Arts and
                        Design"
                    date="October 2023 - February 2024 / January 2025 - March 2025"
                    listElements={
                      <ul>
                        <li>
                          Taught web programming to 100+ students (JavaScript,
                          CSS, HTML, Git, Bootstrap).
                        </li>
                        <li>
                          Developed and delivered lectures/workshops;
                          <br /> created assignments and exams;
                          <br /> provided support and feedback.
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
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                </div>
              </div>

              <div className="resume-list-item">
                <SectionHeader
                  text={"Tech Skills & expertise"}
                  variation="large"
                />

                <div className="awards-list">
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
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
                    topText="MSc, Communication and Web Technologies — University of Aveiro, 2021-2023 (Aveiro)"
                    bottomText="<span>GPA: 4.5 / 5.</span> Top 1% of students ranking."
                  />
                </div>
              </div>

              <div className="resume-list-item">
                <SectionHeader text={"online courses"} variation="large" />

                <div className="awards-list">
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                  <BasicResumeItem text="awwwards honorable mention 2023" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <SectionHeader text={"Contacts"} />

          <h2 className="footer-title">Time to Cook before it's monday</h2>

          <p className="footer-label">
            You made it this far, don’t leave me hanging. Send a message, I’m
            genuinely nice, I promise.
          </p>

          <div className="footer-list">
            <div className="footer-list-item">
              <span></span>
              <a href="http://" target="_blank">
                LinkedIn
              </a>
            </div>
            <div className="footer-list-item">
              <span></span>
              <a href="mailto:" target="_blank">
                LinkedIn
              </a>
              <span></span>
            </div>
            <div className="footer-list-item">
              <a href="http://" target="_blank">
                GitHub
              </a>
              <span></span>
            </div>
          </div>

          <div className="footer-svg">
            {/* <div className="footer-svg-mark-wrapper">
              <FooterMarkBulge className="footer-svg-mark-webgl" />
            </div> */}
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
    </>
  );
}
