import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR } from '@react-three/xr';

const xrStore = createXRStore({
  mode: 'immersive-ar',
  requiredFeatures: ['local-floor']
});

function FloatingPanel() {
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, -1]}>
      {/* Background Panel Mesh */}
      <mesh>
        <planeGeometry args={[0.8, 0.5]} />
        <meshPhysicalMaterial
          color="#121214"
          transmission={0.7}
          roughness={0.2}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Interactive Button Mesh */}
      <mesh 
        position={[0, -0.05, 0.01]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setCount((c) => c + 1)}
      >
        <planeGeometry args={[0.3, 0.1]} />
        <meshBasicMaterial color={hovered ? '#3b82f6' : '#1e3a8a'} />
      </mesh>
    </group>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111' }}>
      <button
        onClick={() => xrStore.enterAR()}
        style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, padding: '12px 24px', fontSize: '16px', fontWeight: 'bold',
          backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Enter AR Mode
      </button>
      <Canvas camera={{ position: [0, 0, 0] }}>
        <XR store={xrStore}>
          <ambientLight intensity={1} />
          <FloatingPanel />
        </XR>
      </Canvas>
    </div>
  );
}