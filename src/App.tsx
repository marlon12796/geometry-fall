import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, ThreeElements, ThreeEvent } from '@react-three/fiber'
import { Physics, useBox, usePlane } from '@react-three/cannon'

const SHAPES = ['box', 'sphere', 'cylinder', 'tetrahedron'] as const
type ShapeType = typeof SHAPES[number]

interface ShapeProps {
  shape: ShapeType
  color: string
  position: [number, number, number]
}

const Shape: React.FC<ShapeProps> = ({ shape, color, ...props }) => {
  const [ref, api] = useBox(() => ({ mass: 1, ...props, scale: [3, 3, 3] })) // Aumenta la escala
  const [isClicked, setIsClicked] = useState(false)

  useFrame(() => {
    if (isClicked) {
      api.applyForce([0, 5, 0], [0, 0, 0])
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

const Plane: React.FC<ThreeElements['mesh']> = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#dcdcdc" /> {/* Color del plano ajustado */}
    </mesh>
  )
}

const randomShape = (): ShapeType => {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

const randomColor = (): string => {
  const hue = Math.random() * 360; // Genera un tono aleatorio
  const saturation = Math.random() * 50 + 50; // Saturación entre 50% y 100%
  const lightness = Math.random() * 30 + 20; // Luminosidad entre 20% y 50%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


const App: React.FC = () => {
  const [shapes, setShapes] = useState<Array<{ id: number; shape: ShapeType; color: string; position: [number, number, number] }>>([])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const createShape = () => {
      setShapes(prevShapes => [
        ...prevShapes,
        {
          id: Date.now(),
          shape: randomShape(),
          color: randomColor(),
          position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2]// Ajusta la altura aquí
        }
      ])
    }

    const startInterval = () => {
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(createShape, 3000)
      }
    }

    const stopInterval = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval()
      } else {
        startInterval()
      }
    }

    startInterval()

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopInterval()
      setShapes([])
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 8, 15], fov: 60 }}> {/* Ajusta la posición de la cámara si es necesario */}
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Physics gravity={[0, -2, 0]}>
          <Plane position={[0, -10, 0]} /> {/* Asegúrate de que el plano esté alineado con la nueva altura */}
          {shapes.map(({ id, shape, color, position }) => (
            <Shape key={id} shape={shape} color={color} position={position} />
          ))}
        </Physics>
      </Canvas>
    </div>
  )
}

export default App