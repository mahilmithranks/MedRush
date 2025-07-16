import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

const ChatBotCapsule = () => {
  const ref = useRef()
  const [open, setOpen] = useState(false)

  // Floating animation
  useFrame(() => {
    if (ref.current) {
      const t = performance.now() / 1000
      ref.current.position.y = 0.6 + Math.sin(t * 2) * 0.1
    }
  })

  return (
    <group ref={ref} position={[-3, 0.3, 3]}>
      {/* Capsule shape */}
      <mesh onClick={() => setOpen(!open)}>
        <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
        <meshStandardMaterial
          color="#00bcd4"
          emissive="#00bcd4"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Chat bubble */}
      {open && (
        <Html position={[0, 1.5, 0]} center occlude>
          <div className="bg-white text-black p-3 rounded shadow w-60 text-xs space-y-2">
            <div className="font-bold">Hi, I'm MedRush AI 🤖</div>
            <div>How can I help you today?</div>
            <input
              type="text"
              placeholder="Type here..."
              className="w-full px-2 py-1 rounded border text-xs"
            />
          </div>
        </Html>
      )}
    </group>
  )
}

export default ChatBotCapsule
