import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber"; // Importing useLoader from @react-three/fiber
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

interface ModelProps {
  path: string;
}

const Model = ({ path }: ModelProps) => {
  // Load the OBJ file using the OBJLoader
  const obj = useLoader(OBJLoader, path);
  
  return <primitive object={obj} scale={1} />;
};

const BlenderModelViewer: React.FC = () => {
  const modelPath = "src\components\BaseHuman.obj"; // Path to your .obj file

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model path={modelPath} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default BlenderModelViewer;
