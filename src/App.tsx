import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { ShapeType } from './config';
import { randomColor, randomShape } from './utils';

const Plane = lazy(() => import('./Components/Plane'));
const Shape = lazy(() => import('./Components/Shape'));

const App: React.FC = () => {
	const [shapes, setShapes] = useState<
		Array<{ id: number; shape: ShapeType; color: string; position: [number, number, number] }>
	>([]);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		const createShape = () => {
			setShapes((prevShapes) => [
				...prevShapes,
				{
					id: Date.now(),
					shape: randomShape(),
					color: randomColor(),
					position: [Math.random() * 12 - 4, 10, Math.random() * 4 - 4],
				},
			]);
		};

		const startInterval = () => {
			if (intervalRef.current === null) {
				intervalRef.current = window.setInterval(createShape, 3000);
			}
		};

		const stopInterval = () => {
			if (intervalRef.current !== null) {
				window.clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};

		const handleVisibilityChange = () => {
			if (document.hidden) {
				stopInterval();
			} else {
				startInterval();
			}
		};

		startInterval();

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			stopInterval();
			setShapes([]);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return (
		<div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
			<Canvas camera={{ position: [0, 8, 15], fov: 60 }}>
				<ambientLight intensity={0.7} />
				<pointLight position={[10, 10, 10]} intensity={0.8} />
				<Physics gravity={[0, -3, 0]}>
					<Suspense fallback={null}>
						<Plane position={[0, -10, 0]} />
						{shapes.map(({ id, shape, color, position }) => (
							<Shape key={id} shape={shape} color={color} position={position} />
						))}
					</Suspense>
				</Physics>
			</Canvas>
		</div>
	);
};

export default App;
