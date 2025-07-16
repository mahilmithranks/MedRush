// client/src/canvas/AuthScene.jsx

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
      {/* Bottom Half - Colored */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 32, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={20}
        />
      </mesh>

      {/* Top Half - White */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 32, 64]} />
        <meshStandardMaterial
          color="white"
          roughness={0.2}
          metalness={0.5}
          transparent
          opacity={20}
        />
      </mesh>
    </group>
  )
}


// Main Scene
function AuthScene() {
  // Define capsule colors
  const capsuleColors = ['#f44336', '#4caf50', '#2196f3','#FFC0CB', '#ffeb3b'] // red, green, blue, pink, yellow

  // Generate 15 random capsules
  const randomCapsules = Array.from({ length: 15 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 10,  // X: -5 to +5
      (Math.random() - 0.5) * 6,   // Y: -3 to +3
      (Math.random() - 0.5) * 6    // Z: -3 to +3
    ],
    scale: 0.6 + Math.random() * 1.2,          // scale: 0.6 to 1.8
    color: capsuleColors[i % capsuleColors.length] // evenly assign one of 5 colors
  }))

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 40 }} style={{ background: 'black' }}>
      {/* Lights */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-5, -5, -5]} intensity={1.4} />
      <pointLight position={[0, 0, 5]} intensity={1.2} />

      {/* Main Center Capsule */}
      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <CapsuleBot />
      </Float>

      {/* Random Colored Capsules */}
      {randomCapsules.map((item, index) => (
        <Float
          key={index}
          speed={1 + Math.random() * 2}
          rotationIntensity={Math.random() * 5}
          floatIntensity={1 + Math.random() * 4}
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

export default AuthScene
