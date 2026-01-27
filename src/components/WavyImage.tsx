// src/components/WavyImage.tsx
"use client";

import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";

type Props = {
  src: string;
  className?: string;
  strength?: number;
  frequency?: number;
  speed?: number;
  segments?: number;
};

function WavyPlane({
  src,
  strength = 0.22,
  frequency = 2.2,
  speed = 1.1,
  segments = 64,
}: Required<Pick<Props, "src">> & Omit<Props, "src" | "className">) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const hoverQuickToRef = useRef<((v: number) => void) | null>(null);

  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const [hovered, setHovered] = useState(false);

  const tex = useTexture(src);

  // ✅ correct texture color space
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      transparent: true,
      // ✅ avoids unexpected tone mapping influence
      toneMapped: false,
      uniforms: {
        uTex: { value: tex },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uStrength: { value: strength },
        uFreq: { value: frequency },
        uSpeed: { value: speed },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uHover;
        uniform vec2 uMouse;
        uniform float uStrength;
        uniform float uFreq;
        uniform float uSpeed;

        void main() {
          vUv = uv;
          vec3 p = position;

          float d = distance(uv, uMouse);
          float falloff = smoothstep(0.55, 0.0, d);

          float wave = sin((uv.x + uv.y) * uFreq * 6.2831 + uTime * uSpeed) * 0.5;
          p.z += wave * falloff * uStrength * uHover;

          p.z += sin(uv.x * uFreq * 10.0 + uTime * uSpeed * 1.2) * 0.03 * uHover;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTex;

        void main() {
          vec4 c = texture2D(uTex, vUv);
          gl_FragColor = c;
        }
      `,
    });

    return m;
  }, [tex, strength, frequency, speed]);

  // Create GSAP "quickTo" once when material exists
  React.useEffect(() => {
    const m = matRef.current;
    if (!m) return;

    // quickTo gives you smooth easing and auto-overwrite
    hoverQuickToRef.current = gsap.quickTo(m.uniforms.uHover, "value", {
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
    });

    return () => {
      hoverQuickToRef.current = null;
    };
  }, []);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uMouse.value.copy(mouseRef.current);
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) mouseRef.current.set(e.uv.x, e.uv.y);
  };

  const onOver = () => {
    setHovered(true);
    hoverQuickToRef.current?.(1);
  };

  const onOut = () => {
    setHovered(false);
    hoverQuickToRef.current?.(0); // ✅ smooth ease-out
  };

  return (
    <mesh onPointerMove={onMove} onPointerOver={onOver} onPointerOut={onOut}>
      <planeGeometry args={[1, 1, segments, segments]} />
      <primitive ref={matRef} object={material} attach="material" />
    </mesh>
  );
}

export function WavyImage({
  src,
  className,
  strength = 0.22,
  frequency = 2.2,
  speed = 1.1,
  segments = 64,
}: Props) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1.7], fov: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        onCreated={({ gl }) => {
          // ✅ correct renderer output colors
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        {/* Fit plane to container */}
        <group scale={[1.6, 2.1, 1]}>
          <WavyPlane
            src={src}
            strength={strength}
            frequency={frequency}
            speed={speed}
            segments={segments}
          />
        </group>
      </Canvas>
    </div>
  );
}
