import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type PulseRingProps = {
  position: [number, number, number];
  radius?: number;
  tube?: number;
  maxOpacity?: number;
  pulseSeconds?: number;
  pulseVertOffset?: number;
  scaleFrom?: number;
  scaleTo?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

export function PulseRing({
  position,
  radius = 0.9,
  tube = 0.04,
  maxOpacity = 0.5,
  pulseSeconds = 1.4, // total duration of one full pulse (in+out)
  pulseVertOffset = 0.2,
  scaleFrom = 0.85,
  scaleTo = 1.55,
  emissive = "#FFB3A7",
  emissiveIntensity = 1.2,
}: PulseRingProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const tRef = useRef(0);

  // Create material once (not every render)
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        color: new THREE.Color("#000000"), // keep surface dark; let emissive drive it
        emissive: new THREE.Color(emissive),
        emissiveIntensity,
      }),
    [emissive, emissiveIntensity]
  );

  // ✅ avoid leaking GPU material if the component unmounts
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, delta) => {
    tRef.current += delta;

    // phase goes 0..1 repeatedly
    const phase = (tRef.current % pulseSeconds) / pulseSeconds;

    // triangle wave: 0 -> 1 -> 0 (with vertical offset)
    const tri = Math.max(
      0,
      phase < 0.5 ? phase * 2 - pulseVertOffset : (1 - phase) * 2 - pulseVertOffset
    );

    // opacity: 0 -> maxOpacity -> 0
    material.opacity = tri * maxOpacity;

    // scale: scaleFrom -> scaleTo during the cycle
    const s = scaleFrom + (scaleTo - scaleFrom) * phase;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, Math.PI / 4, 0]}
      material={material}
      raycast={() => null}
    >
      <torusGeometry args={[radius, tube, 24, 96]} />
    </mesh>
  );
}
