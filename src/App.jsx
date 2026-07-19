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
    
      {/* Glass Backing */}
      
        
        
      
      {/* Simple 3D Mesh Button */}
       setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setCount((c) => c + 1)}
      >
        
        
      
    
  );
}

export default function App() {
  return (
    
       xrStore.enterAR()}
        style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, padding: '12px 24px', fontSize: '16px', fontWeight: 'bold',
          backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px'
        }}
      >
        Enter AR Mode
      
      
        
          
          
        
      
    
  );
}