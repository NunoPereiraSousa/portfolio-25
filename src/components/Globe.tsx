import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

type Props = {
  meridians?: number;
  parallels?: number;
  steps?: number;
  radius?: number;
  speed?: number; // radians/sec
  tilt?: number; // radians
  opacityBack?: number; // 0..1
  opacityFront?: number; // 0..1
  className?: string;
};

function buildMeridian(phi: number, steps: number, r: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    // circle in XY plane
    const x = Math.cos(t) * r;
    const y = Math.sin(t) * r;
    const z = 0;
    const v = new THREE.Vector3(x, y, z);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), phi);
    pts.push(v);
  }
  return pts;
}

function buildParallel(lat: number, steps: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const y = Math.sin(lat) * r;
  const rr = Math.cos(lat) * r;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = Math.cos(t) * rr;
    const z = Math.sin(t) * rr;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

function Rings({
  meridians = 12,
  parallels = 6,
  steps = 160,
  radius = 1,
  speed = 0.6,
  tilt = -0.35,
  opacityBack = 0.15,
  opacityFront = 0.95,
}: Props) {
  const group = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];

    // meridians
    for (let i = 0; i < meridians; i++) {
      const phi = (i / meridians) * Math.PI; // 0..PI ok (symmetry)
      const pts = buildMeridian(phi, steps, radius);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      geos.push(g);
    }

    // parallels
    for (let j = 1; j <= parallels; j++) {
      const lat = (j / (parallels + 1) - 0.5) * Math.PI;
      const pts = buildParallel(lat, steps, radius);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      geos.push(g);
    }

    return geos;
  }, [meridians, parallels, steps, radius]);

  // Simple “front/back” fade using material opacity + depthTest trick:
  // We'll draw twice: once dim (back), once brighter (front) with additive blending feel.
  // This is a lightweight approximation that looks like your reference.
  const matBack = useMemo(() => {
    const m = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: opacityBack,
      depthTest: true,
    });
    return m;
  }, [opacityBack]);

  const matFront = useMemo(() => {
    const m = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: opacityFront,
      depthTest: true,
    });
    return m;
  }, [opacityFront]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += speed * delta;
    group.current.rotation.x = tilt;
  });

  return (
    <group ref={group}>
      {/* back pass */}
      {geometries.map((g, i) => (
        <primitive key={i} object={new THREE.Line(g, matBack)} />
      ))}
      {/* front pass */}
      {geometries.map((g, i) => (
        <primitive key={i} object={new THREE.Line(g, matFront)} />
      ))}
    </group>
  );
}

export function WireGlobeR3F(props: Props) {
  return (
    <div className={props.className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 39 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "low-power" }}
      >
        <Rings {...props} />
      </Canvas>
    </div>
  );
}
