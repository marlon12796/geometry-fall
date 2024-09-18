import { useBox } from "@react-three/cannon"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import { useState } from "react"
import { ShapeType } from "../config"


interface ShapeProps {
  shape: ShapeType
  color: string
  position: [number, number, number]
}

const Shape: React.FC<ShapeProps> = ({ shape, color, ...props }) => {
  const [ref, api] = useBox(() => ({ mass: 1, ...props, scale: [2, 2, 2] })) // Aumenta la escala
  const [isClicked, setIsClicked] = useState(false)

  useFrame(() => {
    if (isClicked) {
      api.applyForce([0, 8, 0], [0, 0, 0])
    }
  })

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsClicked(true)
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsClicked(false)
  }

  return (
    <mesh
      {...props}
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {shape === 'box' && <boxGeometry />}
      {shape === 'sphere' && <sphereGeometry />}
      {shape === 'cylinder' && <cylinderGeometry />}
      {shape === 'tetrahedron' && <tetrahedronGeometry />} 
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
export default Shape