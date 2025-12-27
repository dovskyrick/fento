import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Text } from '@react-three/drei'



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

function PortfolioWalls() {
  return (
    <group>
      {/* XY wall (front-facing panel) */}
      <mesh position={[0, 1.5, -2]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          color="#0B0F14"
          emissive="#2DE2E6"
          emissiveIntensity={1.1}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* YZ wall (side panel) */}
      <mesh position={[3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial
          color="#0B0F14"
          emissive="#C7A25E"
          emissiveIntensity={1.0}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* ART label — baseline near y=0 */}
      <Text
        position={[5, 0.05, 5]}
        fontSize={0.5}
        anchorX="left"
        anchorY="bottom"
      >
        ART
        <meshStandardMaterial emissive="#2DE2E6" emissiveIntensity={1.6} />
      </Text>

      {/* ENGINEERING label — higher y */}
      <Text
        position={[5, 5, 5]}
        fontSize={0.45}
        anchorX="left"
        anchorY="bottom"
      >
        ENGINEERING
        <meshStandardMaterial emissive="#C7A25E" emissiveIntensity={1.4} />
      </Text>
    </group>
  );
}



export default function Scene() {
  return (
    <>
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
        <PortfolioWalls />
        <OrbitControls {...orbitControlsProps}/>
      </Canvas>

      <Credits />
    </>
  )
}
