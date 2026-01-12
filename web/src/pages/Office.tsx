import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useEffect, useState } from "react";


import { Clickable } from "@/components/interaction/Clickable"
import { PulseRing } from "@/components/effects/PulseRing"

// Hook to detect mobile/narrow screens
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
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
      "Low Poly Computer Desk" (https://skfb.ly/6SUML) by Nyangire is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    </div>
  )
}

function Instructions() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '25px',
        opacity: 0.85,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
        textAlign: 'center',
        whiteSpace: 'pre-line',
        padding: '20px 40px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        backdropFilter: 'blur(4px)',
      }}
    >
      Click the computer for my Github{'\n'}Click the papers for my CV
    </div>
  )
}

function Model() {
  try {
    const { scene } = useGLTF('/desk.glb')
    return <primitive object={scene} scale={0.05} />
  } catch (error) {
    console.error('Failed to load desk model:', error)
    return null
  }
}


const orbitControlsProps = {
  enableDamping: true,
  dampingFactor: 0.08,
  minDistance: 6,
  maxDistance: 18,
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI * 0.48,
} as const;




export default function Office() {
  const isMobile = useIsMobile();
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

  // Adjust orbit controls for mobile - allow more zoom out
  const orbitProps = {
    ...orbitControlsProps,
    maxDistance: isMobile ? 25 : orbitControlsProps.maxDistance, // More zoom out on mobile
  };

  return (
    <>
      <Canvas dpr={[0.3, 0.7]} camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
        <OrbitControls {...orbitProps}/>
        <Effects />

        {/* 🔔 Onboarding pulse */}
        {showOnboarding && (
          <>
            <PulseRing position={[2, 4.3, 2]} />
            {/* add another TorusPulse if you want */}
          </>
        )}
        <Clickable
            href="https://github.com/dovskyrick/grafana-satellite-visualizer"
            position={[-0.2, 5, 2]}
            size={[1.6, 1.3, 0.3]}
            rotation={[-0.1, 0, 0]}  // TODO: adjust rotation as needed
            opacity={0.008}                 // set to 0 later, no renaming needed
            baseColor="#ffffff"
            emissiveColor="#F3F2EE"         // matches your ART text vibe
            emissiveIntensity={0.15}
            hoverEmissiveIntensity={9}
            onActivate={commitEnteredInterior} // ✅ HERE
        />
        <Clickable
            href="/cv.pdf"
            position={[3.8, 3.8, 2]}
            size={[1.1, 1.4, 0.4]}
            rotation={[Math.PI / 2, 0, 0]}  // TODO: adjust rotation as needed
            opacity={0.008}                 // set to 0 later, no renaming needed
            baseColor="#ffffff"
            emissiveColor="#F3F2EE"         // matches your ART text vibe
            emissiveIntensity={0.15}
            hoverEmissiveIntensity={13}
            onActivate={commitEnteredInterior} // ✅ HERE
        />
        </Canvas>
      <Instructions />
      <Credits />
    </>
  )
}
