import { GuitarStringsCanvas } from "../ShaderBackground";

export function DesktopBackgroundLines() {
  return (
    <div className="webgl-desktop-lines">
      <GuitarStringsCanvas
        grid={56}
        rowGrid={56}
        step={18}
        dprCap={1.5}
        baseAlpha={0.1}
      />
    </div>
  );
}

export function MobileBackgroundLines() {
  return (
    <div className="webgl-mobile-lines">
      <div className="webgl-mobile-lines__vertical" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="webgl-mobile-lines__horizontal" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
