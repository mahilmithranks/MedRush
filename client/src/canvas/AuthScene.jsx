import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'

// Capsule Component
function CapsuleBot({ position = [0, 0, 0], scale = 1, color = '#f44336' }) {
  const capsuleRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (hovered && capsuleRef.current) {
      capsuleRef.current.rotation.y += 0.01
    }
  })

  return (
    <group
      ref={capsuleRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={position}
      scale={scale}
    >
      {/* Bottom Half */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 32, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={0}
          metalness={0.4}
          transparent
          opacity={10}
        />
      </mesh>
      {/* Top Half */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 32, 64]} />
        <meshStandardMaterial
          color="white"
          roughness={0}
          metalness={0.5}
          transparent
          opacity={10}
        />
      </mesh>
    </group>
  )
}

function AuthSceneCanvas() {
  const capsuleColors = ['#f44336', '#FEF098', '#2196f3', '#FFC0CB', '#FFD700']

  // ✅ Store generated capsules in a ref (persists across re-renders, never regenerates)
  const capsuleDataRef = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ],
      scale: 0.6 + Math.random() * 1.2,
      color: capsuleColors[i % capsuleColors.length],
      floatSpeed: 1 + Math.random() * 2,
      floatIntensity: 1 + Math.random() * 4,
      rotateIntensity: Math.random() * 5
    }))
  )

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'black' }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-5, -5, -5]} intensity={1.4} />
      <pointLight position={[0, 0, 5]} intensity={1.2} />

      {/* Main center capsule */}
      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <CapsuleBot />
      </Float>

      {/* Random capsules — stable and floating */}
      {capsuleDataRef.current.map((item, index) => (
        <Float
          key={index}
          speed={item.floatSpeed}
          rotationIntensity={item.rotateIntensity}
          floatIntensity={item.floatIntensity}
        >
          <CapsuleBot
            position={item.position}
            scale={item.scale}
            color={item.color}
          />
        </Float>
      ))}

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}

export default React.memo(AuthSceneCanvas)
