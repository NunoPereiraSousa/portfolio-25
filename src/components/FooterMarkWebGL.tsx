import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";

// Vite: get an actual URL
import svgUrl from "../assets/images/nUNO.svg?url";

function useSvgCanvasTexture(url: string, targetWidth = 2048) {
  const [tex, setTex] = React.useState<THREE.CanvasTexture | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      const svgText = await fetch(url).then((r) => r.text());
      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.decoding = "async";
      img.src = blobUrl;
      await img.decode();

      // Keep your SVG aspect ratio (1400 / 374)
      const aspect = 374 / 1400;
      const w = targetWidth;
      const h = Math.round(targetWidth * aspect);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      URL.revokeObjectURL(blobUrl);

      if (!alive) return;

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;

      setTex(texture);
    })();

    return () => {
      alive = false;
    };
  }, [url, targetWidth]);

  return tex;
}

// Codrops-style bulge: displace Z on a subdivided plane under the mouse
const vertexShader = /* glsl */ `
  uniform vec2  uMouse;      // plane UV (0..1)
  uniform float uRadius;     // bulge radius in UV
  uniform float uIntensity;  // bulge height
  uniform float uHover;      // 0..1
    uniform float uAspect;
  varying vec2 vUv;


    float circleMask(vec2 uv, vec2 p, float r, float aspect) {
        vec2 d = uv - p;
        d.x *= aspect;           
        float dist = length(d);
        return 1.0 - smoothstep(0.0, r, dist);
    }

  void main() {
    vUv = uv;

    vec3 p = position;

    float m = circleMask(uv, uMouse, uRadius, uAspect);
    p.z += m * uIntensity * uHover;

    // three-custom-shader-material hook:
    csm_Position = p;
  }
`;

const fragmentShader = /* glsl */ `
    uniform sampler2D uTexture;
varying vec2 vUv;

// sRGB -> linear
vec3 srgbToLinear(vec3 c) {
  return pow(c, vec3(2.2));
}

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  // Exact #EF5143 in sRGB
  vec3 brandSRGB = vec3(239.0/255.0, 81.0/255.0, 67.0/255.0);

  // Convert to linear before outputting
  vec3 brand = srgbToLinear(brandSRGB);

  csm_DiffuseColor = vec4(brand, tex.a);
}
`;

function BulgePlane({ texture }: { texture: THREE.Texture }) {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const hoverTarget = React.useRef(0);
  const hover = React.useRef(0);

  const { viewport } = useThree();

  const uniforms = React.useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.18 }, // tweak 0.12..0.25
      uIntensity: { value: 2.0 }, // tweak 0.4..1.5
      uHover: { value: 0.0 },
      uAspect: { value: viewport.width / viewport.height }, // ✅ NEW
    }),
    [texture],
  );

  useFrame((dt) => {
    hover.current = THREE.MathUtils.damp(
      hover.current,
      hoverTarget.current,
      12,
      dt,
    );
    uniforms.uHover.value = hover.current;
  });

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoverTarget.current = 1;
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          hoverTarget.current = 0;
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.uv) uniforms.uMouse.value.set(e.uv.x, e.uv.y);
        }}
      >
        {/* Dense plane = smooth bulge */}
        <planeGeometry args={[viewport.width, viewport.height, 240, 240]} />

        <CustomShaderMaterial
          baseMaterial={THREE.MeshBasicMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          alphaTest={0.01}
          depthWrite={false}
        />
      </mesh>

      {/* <pointLight position={[2, 4, 6]} intensity={25} distance={12} decay={1} /> */}
      {/* <ambientLight intensity={1} /> */}
    </>
  );
}

export function FooterMarkBulge({ className }: { className?: string }) {
  const texture = useSvgCanvasTexture(svgUrl, 2048);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.NoToneMapping, // ✅ important
          outputColorSpace: THREE.SRGBColorSpace, // ✅ important (r152+)
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={114} />
        {texture && <BulgePlane texture={texture} />}
      </Canvas>
    </div>
  );
}
