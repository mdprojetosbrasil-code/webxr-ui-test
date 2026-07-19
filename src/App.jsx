import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { createXRStore, XR } from '@react-three/xr';

export default function App() {
  const [xrStore, setXrStore] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const targetImageElement = new Image();
    // Path must cleanly point to your repo structure
    targetImageElement.src = '/webxr-ui-test/target-logo.png'; 
    
    targetImageElement.onload = () => {
      const store = createXRStore({
        mode: 'immersive-ar',
        // 1. DEMOTED TO OPTIONAL: This prevents the app from crashing if tracking fails to start
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['image-tracking'],
        customSessionInit: {
          trackedImages: [
            {
              image: targetImageElement,
              widthInMeters: 0.15 
            }
          ]
        }
      });
      setXrStore(store);
      setIsReady(true);
    };

    targetImageElement.onerror = () => {
      console.warn("Target image not found, falling back to basic AR...");
      const fallbackStore = createXRStore({
        mode: 'immersive-ar',
        requiredFeatures: ['local-floor']
      });
      setXrStore(fallbackStore);
      setIsReady(true);
    };
  }, []);

  // 2. ERROR CAPTURING FUNCTION
  const handleEnterAR = async () => {
    if (!xrStore) return;
    try {
      await xrStore.enterAR();
    } catch (error) {
      // This will throw a popup on your tablet showing exactly why Chrome blocked it
      alert(`WebXR Session Failed: ${error.name} - ${error.message}`);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111' }}>
      
      <button
        disabled={!isReady}
        onClick={handleEnterAR}
        style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, padding: '12px 24px', fontSize: '16px', fontWeight: 'bold',
          backgroundColor: isReady ? '#3b82f6' : '#555', color: 'white', border: 'none', borderRadius: '8px',
          cursor: isReady ? 'pointer' : 'not-allowed'
        }}
      >
        {isReady ? "Enter AR Mode" : "Loading Engine..."}
      </button>
      
      <Canvas camera={{ position: [0, 0, 0] }}>
        {xrStore && (
          <XR store={xrStore}>
            <ambientLight intensity={1} />
            <ObjectTrackedPanel />
          </XR>
        )}
      </Canvas>
    </div>
  );
}

function ObjectTrackedPanel() {
  const panelRef = useRef();
  const [tracked, setTracked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  useFrame(() => {
    const frame = gl.xr.getFrame();
    const session = gl.xr.getSession();
    
    if (!frame || !session) return;

    if (frame.getTrackedImageResults) {
      const results = frame.getTrackedImageResults();
      
      if (results.length > 0) {
        const imageResult = results[0]; 
        const referenceSpace = gl.xr.getReferenceSpace();
        const pose = frame.getPose(imageResult.imageSpace, referenceSpace);

        if (imageResult.trackingState === "tracked" && pose) {
          setTracked(true);
          panelRef.current.position.copy(pose.transform.position);
          panelRef.current.quaternion.copy(pose.transform.orientation);
          panelRef.current.translateZ(0.05); 
          panelRef.current.translateY(0.1);  
        } else if (imageResult.trackingState === "emulated") {
          setTracked(true);
        } else {
          setTracked(false);
        }
      }
    }
  });

  return (
    <group ref={panelRef} visible={tracked}>
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
      <mesh 
        position={[0, -0.05, 0.01]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          alert("Panel interaction success!");
        }}
      >
        <planeGeometry args={[0.3, 0.1]} />
        <meshBasicMaterial color={hovered ? '#3b82f6' : '#1e3a8a'} />
      </mesh>
    </group>
  );
}