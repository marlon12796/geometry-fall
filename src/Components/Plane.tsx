import { usePlane } from "@react-three/cannon"
import { ThreeElements } from "@react-three/fiber"

export const Plane: React.FC<ThreeElements['mesh']> = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#dcdcdc" /> 
    </mesh>
  )
}
