import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Text3D, Center } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useEffect, useState } from "react";


import { Clickable } from "@/components/interaction/Clickable"
import { PulseRing } from "@/components/effects/PulseRing"





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
      
    </div>
  )
}

function Model() {
  const { scene } = useGLTF('/desk.glb')
  return <primitive object={scene} scale={0.05} />
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


export default function Office() {
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
            <PulseRing position={[2, 4.3, 2]} />
            {/* add another TorusPulse if you want */}
          </>
        )}
        <Clickable
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
        <Clickable
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
