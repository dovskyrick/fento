import { Canvas , useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Text3D, Center } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";








function TorusPulse({
  position,
  radius = 0.9,
  tube = 0.04,
  maxOpacity = 0.5,
  pulseSeconds = 1.4,     // total duration of one full pulse (in+out)
  pulseVertOffset = 0.2,
  scaleFrom = 0.85,
  scaleTo = 1.55,
  emissive = "#FFB3A7",
  emissiveIntensity = 1.2,
}: {
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
}) {
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

  useFrame((_, delta) => {
    tRef.current += delta;

    // phase goes 0..1 repeatedly
    const phase = (tRef.current % pulseSeconds) / pulseSeconds;

    // triangle wave: 0 -> 1 -> 0
    const tri = Math.max(0, phase < 0.5 ? phase * 2 - pulseVertOffset : (1 - phase) * 2 - pulseVertOffset);

    // opacity: 0 -> maxOpacity -> 0
    material.opacity = tri * maxOpacity;

    // scale: scaleFrom -> scaleTo (monotonic) during the pulse
    // If you want it to only grow (not shrink), tie it to phase (0..1)
    const s = scaleFrom + (scaleTo - scaleFrom) * phase;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh 
    ref={meshRef} 
    position={position} 
    rotation={[0, Math.PI/4, 0]}
    material={material}
    raycast={() => null} 
    >
      <torusGeometry args={[radius, tube, 24, 96]} />
    </mesh>
  );
}




function HotspotBox({
  href,                          // external link
  position,
  size,
  opacity = 0.12,               // 0 makes it invisible but still clickable
  baseColor = "#ffffff",
  emissiveColor = "#ffffff",
  emissiveIntensity = 0.2,
  hoverEmissiveIntensity = 1.2,
  hoverScale = 1.15,
  openInNewTab = true,
  onActivate,
}: {
  href: string;
  position: [number, number, number];
  size: [number, number, number];
  opacity?: number;
  baseColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  hoverEmissiveIntensity?: number;
  hoverScale?: number;
  openInNewTab?: boolean;
  onActivate?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Create the material once (unless these specific deps change).
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      transparent: opacity < 1,
      opacity,
      color: new THREE.Color(baseColor),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity,
      depthWrite: false,
    });
    return m;
  }, [opacity, baseColor, emissiveColor, emissiveIntensity]);

  // Update only the intensity on hover (cheap) without recreating the material.
  if (material.emissiveIntensity !== (hovered ? hoverEmissiveIntensity : emissiveIntensity)) {
    material.emissiveIntensity = hovered ? hoverEmissiveIntensity : emissiveIntensity;
  }

  const scale: [number, number, number] = hovered
    ? [hoverScale, hoverScale, hoverScale]
    : [1, 1, 1];

  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[0, Math.PI/4, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onActivate?.(); // ✅ call parent callback if provided
        if (openInNewTab) {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = href;
        }
      }}
    >
      <boxGeometry args={size} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}





function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.22}
        luminanceThreshold={0.11}
        luminanceSmoothing={0.30}
      />
    </EffectComposer>
  );
}

function Credits() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '12px',
        right: '12px',
        color: 'white',
        fontSize: '12px',
        opacity: 0.7,
        fontFamily: 'monospace',
        pointerEvents: 'none',
      }}
    >
      "SKVOT Lesson / Low-Poly Futuristic Building" (https://skfb.ly/oZB6v) by jsandorblendercourse is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    </div>
  )
}

function Model() {
  const { scene } = useGLTF('/building.glb')
  return <primitive object={scene} scale={1} />
}


const orbitControlsProps = {
  enableDamping: true,
  dampingFactor: 0.08,
  minDistance: 6,
  maxDistance: 18,
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI * 0.48,
} as const;

function Labels3D() {
  return (
    <group>
      <Center position={[5, 1, 2]} rotation={[0, 0, 0]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.55}
          height={0.08}          // thickness
          curveSegments={10}
          bevelEnabled
          bevelThickness={0.015}
          bevelSize={0.01}
          bevelSegments={5}
        >
          ART
          <meshStandardMaterial
            color="#FFB3A7"
            emissive="#FFB3A7"
            emissiveIntensity={1.2}
            metalness={0.2}
            roughness={0.3}
          />
        </Text3D>
      </Center>

      <Center position={[2, 4, 7]} rotation={[0, Math.PI/2, 0]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.45}
          height={0.07}
          curveSegments={10}
          bevelEnabled
          bevelThickness={0.012}
          bevelSize={0.008}
          bevelSegments={5}
        >
          ENGINEERING
          <meshStandardMaterial
            color="#F3F2EE"
            emissive="#C7A25E"
            emissiveIntensity={1.1}
            metalness={0.2}
            roughness={0.35}
          />
        </Text3D>
      </Center>
    </group>
  );
}


export default function Exterior() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const hasSeen = localStorage.getItem("enteredInteriorOnce") === "1";
  
    if (!hasSeen) {
      const t = setTimeout(() => {
        setShowOnboarding(true);
      }, 3500); // 3.5s after page load
  
      return () => clearTimeout(t);
    }
  }, []);


  const commitEnteredInterior = () => {
    localStorage.setItem("enteredInteriorOnce", "1");
    setShowOnboarding(false);
  };


  return (
    <>
      <Canvas dpr={[0.3, 0.7]} camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
        <Labels3D />
        <OrbitControls {...orbitControlsProps}/>
        <Effects />

        {/* 🔔 Onboarding pulse */}
        {showOnboarding && (
          <>
            <TorusPulse position={[2, 4.3, 2]} />
            {/* add another TorusPulse if you want */}
          </>
        )}
        <HotspotBox
            href="https://instagram.com/nhecus"
            position={[1.7, 1.05, 1.7]}
            size={[1.1, 1.8, 0.6]}
            opacity={0.008}                 // set to 0 later, no renaming needed
            baseColor="#ffffff"
            emissiveColor="#FFB3A7"         // matches your ART text vibe
            emissiveIntensity={0.15}
            hoverEmissiveIntensity={9}
            onActivate={commitEnteredInterior} // ✅ HERE
        />
        <HotspotBox
            href="/cv.pdf"
            position={[1.7, 4.3, 1.7]}
            size={[1.1, 1.8, 0.6]}
            opacity={0.008}                 // set to 0 later, no renaming needed
            baseColor="#ffffff"
            emissiveColor="#F3F2EE"         // matches your ART text vibe
            emissiveIntensity={0.15}
            hoverEmissiveIntensity={13}
            onActivate={commitEnteredInterior} // ✅ HERE
        />
        </Canvas>
      
      <Credits />
    </>
  )
}
