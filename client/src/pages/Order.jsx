import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'

const FloatingPrescription = ({ trigger }) => {
  const meshRef = useRef()
  const [y, setY] = useState(0)

  useFrame(() => {
    if (trigger && meshRef.current) {
      if (y < 3) {
        setY(y + 0.03)
        meshRef.current.position.y = y
        meshRef.current.position.z -= 0.02
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[-2, 0.3, 2]}>
      <boxGeometry args={[1, 0.02, 1.5]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

const ServerCube = () => {
  return (
    <mesh position={[2, 0.5, -2]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  )
}

const Order = () => {
  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    setUploading(true)
  }

  return (
    <div className="w-screen h-screen bg-gray-900">
      <div className="absolute top-5 left-5 z-10">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleUpload}
        >
          Upload Prescription
        </button>
      </div>

      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <OrbitControls />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1e1e1e" />
        </mesh>

        {/* Components */}
        <FloatingPrescription trigger={uploading} />
        <ServerCube />
      </Canvas>
    </div>
  )
}

export default Order
