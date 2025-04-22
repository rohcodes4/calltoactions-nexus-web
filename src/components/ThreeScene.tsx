import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Float,
  Environment,
  Text3D,
} from "@react-three/drei";
import * as THREE from "three";

// Floating 3D text component
const FloatingText = ({ position = [0, 0, 0], text = "TBD" }) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (textRef.current) {
      const time = clock.getElapsedTime();
      textRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      textRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={textRef}
        position={position as [number, number, number]}
        font="/fonts/Inter_Bold.json"
        size={0.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial
          color="#7928CA"
          emissive="#7928CA"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Text3D>
    </Float>
  );
};

// Interactive blob sphere
const InteractiveSphere = ({ position = [0, 0, 0], color = "#4CC9F0" }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
  <mesh
    ref={meshRef}
    position={position as [number, number, number]}
    onClick={() => setClicked(!clicked)}
    onPointerOver={() => setHovered(true)}
    onPointerOut={() => setHovered(false)}
    castShadow
  >
    <sphereGeometry args={[1, 64, 64]} />
    <MeshDistortMaterial
      color={hovered ? "#7928CA" : color}
      distort={0.5}
      speed={3}
      roughness={0.2}
      metalness={0.8}
    />
  </mesh>
</Float>

  );
};

// Particle field
const ParticleField = ({ count = 100 }) => {
  const points = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 15;
      arr[i + 1] = (Math.random() - 0.5) * 15;
      arr[i + 2] = (Math.random() - 0.5) * 15;
    }
    setPositions(arr);
  }, [count]);

  useFrame(({ clock }) => {
    if (points.current) {
      const time = clock.getElapsedTime();
      points.current.rotation.x = Math.sin(time * 0.1) * 0.2;
      points.current.rotation.y = Math.sin(time * 0.2) * 0.2;
    }
  });

  if (!positions) return null;

  return (
    <points ref={points} key={positions.toString()}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4CC9F0"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

const SceneContainer = () => {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#0f0f13"]} />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.2}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <group position={[0, 0, 0]}>
          <FloatingText position={[0, 1.5, 0]} />
          <InteractiveSphere position={[-2, -1, 0]} color="#00bfff" />
          <InteractiveSphere position={[2, -1, 0]} color="#7928CA" />
          <ParticleField count={200} />
        </group>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default SceneContainer;
