import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import svgUrl from "@/assets/images/nuno.svg?url";

const SVG_ASPECT_RATIO = 1400 / 374;

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uTime;
  uniform float uHover;
  uniform float uAspect;

  float circleMask(vec2 uv, vec2 point, float radius, float aspect) {
    vec2 delta = uv - point;
    delta.x *= aspect;
    float dist = length(delta);
    return 1.0 - smoothstep(0.0, radius, dist);
  }

  void main() {
    vUv = uv;

    vec3 displaced = position;
    vec2 delta = uv - uMouse;
    delta.x *= uAspect;

    float dist = length(delta);
    float mask = circleMask(uv, uMouse, uRadius, uAspect);
    float wave = sin(dist * 10.0 - uTime * 2.0);
    float ribbon = sin((uv.x * 4.5 + uv.y * 2.0) - uTime * 1.2);
    vec2 direction = dist > 0.0001 ? normalize(delta) : vec2(0.0);

    displaced.xy += direction * wave * mask * uHover * 0.035;
    displaced.y += ribbon * mask * uHover * 0.035;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uTime;
  uniform float uHover;
  uniform float uAspect;

  float circleMask(vec2 uv, vec2 point, float radius, float aspect) {
    vec2 delta = uv - point;
    delta.x *= aspect;
    float dist = length(delta);
    return 1.0 - smoothstep(0.0, radius, dist);
  }

  void main() {
    vec2 delta = vUv - uMouse;
    delta.x *= uAspect;

    float dist = length(delta);
    float mask = circleMask(vUv, uMouse, uRadius, uAspect);
    float wave = sin(dist * 12.0 - uTime * 2.2);
    float flow = sin((vUv.x * 5.5 + vUv.y * 2.5) - uTime * 1.5);
    vec2 direction = dist > 0.0001 ? normalize(delta) : vec2(0.0);
    direction.x /= uAspect;

    vec2 tangent = vec2(-direction.y, direction.x);
    vec2 uv = vUv;
    uv -= direction * wave * mask * uHover * 0.018;
    uv += tangent * flow * mask * uHover * 0.02;

    vec4 tex = texture2D(uTexture, uv);
    vec3 accent = vec3(239.0 / 255.0, 81.0 / 255.0, 67.0 / 255.0);

    gl_FragColor = vec4(accent, tex.a);
  }
`;

type FooterMarkDeformProps = {
  className?: string;
  fallback?: ReactNode;
};

function useSvgCanvasTexture(url: string, enabled: boolean, targetWidth = 2048) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    let textureToDispose: THREE.CanvasTexture | null = null;
    let blobUrl: string | null = null;

    async function loadTexture() {
      const svgText = await fetch(url).then((response) => response.text());
      blobUrl = URL.createObjectURL(
        new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
      );

      const image = new Image();
      image.decoding = "async";
      image.src = blobUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = Math.round(targetWidth / SVG_ASPECT_RATIO);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const nextTexture = new THREE.CanvasTexture(canvas);
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.minFilter = THREE.LinearFilter;
      nextTexture.magFilter = THREE.LinearFilter;
      nextTexture.needsUpdate = true;

      textureToDispose = nextTexture;
      if (alive) setTexture(nextTexture);
    }

    loadTexture().catch(() => undefined);

    return () => {
      alive = false;
      textureToDispose?.dispose();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [enabled, targetWidth, url]);

  return texture;
}

function DeformPlane({
  texture,
  onReady,
}: {
  texture: THREE.Texture;
  onReady: () => void;
}) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const hoverTargetRef = useRef(0);
  const hoverRef = useRef(0);
  const readyFrameRef = useRef(0);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.64 },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uAspect: { value: SVG_ASPECT_RATIO },
    }),
    [texture],
  );

  useFrame((_, delta) => {
    hoverRef.current = THREE.MathUtils.damp(
      hoverRef.current,
      hoverTargetRef.current,
      4,
      delta,
    );
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uHover.value = hoverRef.current;
    material.uniforms.uTime.value += delta;

    if (readyFrameRef.current < 2) {
      readyFrameRef.current += 1;

      if (readyFrameRef.current === 2) {
        onReady();
      }
    }
  });

  return (
    <mesh
      onPointerOver={(event) => {
        event.stopPropagation();
        hoverTargetRef.current = 1;
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        hoverTargetRef.current = 0;
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        if (event.uv) uniforms.uMouse.value.set(event.uv.x, event.uv.y);
      }}
    >
      <planeGeometry args={[viewport.width, viewport.height, 180, 48]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export function FooterMarkDeform({ className, fallback }: FooterMarkDeformProps) {
  const texture = useSvgCanvasTexture(svgUrl, true);
  const [canvasReady, setCanvasReady] = useState(false);

  return (
    <div className={className}>
      <div
        className="footer-svg-mark-fallback"
        data-hidden={canvasReady}
        aria-hidden={canvasReady}
      >
        {fallback}
      </div>
      <Canvas
        className="footer-svg-mark-canvas"
        orthographic
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
        {texture && (
          <DeformPlane
            texture={texture}
            onReady={() => setCanvasReady(true)}
          />
        )}
      </Canvas>
    </div>
  );
}
