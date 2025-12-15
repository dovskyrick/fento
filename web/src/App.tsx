import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function App() {
  return (
    <Canvas>
      {/* light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} />

      {/* object */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* controls */}
      <OrbitControls />
    </Canvas>
  )
}
