import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import type { Mesh } from 'three';

function RotatingBox() {
    const meshRef = useRef<Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} scale={2.5} position={[4, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
                metalness={1}
                roughness={0.3858823529411765}
            />
        </mesh>
    );
}

export function Procedural3D() {
    return (
        <Canvas>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Environment preset="studio" />
            <RotatingBox />
        </Canvas>
    );
}
