// A simplified look at how we'd render a 3D light model
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, MeshReflectorMaterial } from '@react-three/drei'

function DesignerLightModel() {
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
      <color attach="background" args={['#050505']} />
      <Stage environment="city" intensity={0.5}>
        {/* This is where your friend's 3D model (GLB/GLTF) would go */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshReflectorMaterial 
            blur={[300, 100]} 
            resolution={2048} 
            mixBlur={1} 
            opacity={0.5} 
            color="#101010" 
          />
        </mesh>
      </Stage>
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  )
}