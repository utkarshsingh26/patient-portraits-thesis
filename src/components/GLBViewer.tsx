import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { Box, Paper, Typography } from '@mui/material';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import OBJLoader from Three.js

interface OBJViewerProps {
  modelPath: string; // Path to the .obj file
}

const OBJViewer: React.FC<OBJViewerProps> = ({ modelPath }) => {
  const obj = useLoader(OBJLoader, modelPath); // Load the .obj model

  return (
    <Box sx={{ height: '400px', width: '100%' }}>
      <Paper elevation={3} sx={{ height: '100%' }}>
        <Typography variant="h6" align="center" sx={{ margin: '10px' }}>
          3D Model Viewer
        </Typography>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <primitive object={obj} scale={1.5} />
          <OrbitControls />
        </Canvas>
      </Paper>
    </Box>
  );
};

export default OBJViewer;
