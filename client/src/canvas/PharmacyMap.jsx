import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import axios from 'axios'
import ChatBotCapsule from './ChatBotCapsule'


const PharmacyMarker = ({ position, pharmacy, onClick, isSelected }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(pharmacy)}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={pharmacy.isOpen ? 'limegreen' : 'red'}
          emissive={pharmacy.isOpen ? 'limegreen' : 'red'}
          emissiveIntensity={0.6}
        />
      </mesh>

      {(hovered || isSelected) && (
        <Html position={[0, 0.6, 0]} distanceFactor={10} center>
          <div className="bg-white px-3 py-1 rounded shadow text-black text-xs font-bold whitespace-nowrap">
            {pharmacy.name}
          </div>
        </Html>
      )}

      {isSelected && (
        <Html position={[1.2, 1, 0]} distanceFactor={12}>
          <div className="bg-white p-4 rounded-lg shadow-lg w-48 text-black text-sm space-y-2">
            <img
              src={pharmacy.pharmacistPhoto || 'https://via.placeholder.com/150'}
              alt="Pharmacist"
              className="w-full h-24 object-cover rounded"
            />
            <div><b>{pharmacy.name}</b></div>
            <div className="text-xs">Pincode: {pharmacy.pinCode}</div>
            <div className={`font-semibold ${pharmacy.isOpen ? 'text-green-600' : 'text-red-500'}`}>
              {pharmacy.isOpen ? 'Open Now' : 'Closed'}
            </div>
            <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">
              Request Medicine
            </button>
          </div>
        </Html>
      )}
    </group>
  )
}

const PharmacyMap = () => {
  const [pharmacies, setPharmacies] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pharmacies')
        setPharmacies(res.data)
      } catch (error) {
        console.error('Error fetching pharmacies:', error)
      }
    }

    fetchPharmacies()
  }, [])

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <OrbitControls />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Pharmacies */}
      {pharmacies.map((pharm, i) => {
        const lat = pharm.location?.lat || 0
        const lng = pharm.location?.lng || 0
        const position = [lat, 0.3, lng]

        return (
          <PharmacyMarker
            key={i}
            pharmacy={pharm}
            position={position}
            isSelected={selected?._id === pharm._id}
            onClick={(pharm) => setSelected(pharm)}
          />
        )
      })}
      <ChatBotCapsule />
    </Canvas>
  )
}

export default PharmacyMap
