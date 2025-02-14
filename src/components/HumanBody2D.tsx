import React, { useRef, useState, useEffect } from "react";
import { Button, Tooltip, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";


interface HumanBodyProps {
  taggedLocations: string[];
  botMessageContent: string;
}

const HumanBody: React.FC<HumanBodyProps> = ({ taggedLocations, botMessageContent }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [activeTags, setActiveTags] = useState<string[]>(taggedLocations);

  useEffect(() => {
    setActiveTags(taggedLocations);
  }, [taggedLocations]);

  const highlightPositions = {
    chest: { x: 250, y: 120 },
    hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
    face: { x: 250, y: 50 },
    crotch: { x: 250, y: 230 },
    butt: { x: 250, y: 250 },
    leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
    foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }]
  };

  const handleZoom = (factor: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(prev.scale * factor, 3))
    }));
  };

  const handlePan = (dx: number, dy: number) => {
    setTransform(prev => ({
      ...prev,
      translateX: prev.translateX + dx / prev.scale,
      translateY: prev.translateY + dy / prev.scale
    }));
  };

  const handleReset = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
    setActiveTags(taggedLocations);
  };

  return (
    <Box sx={{ position: "relative", width: "500px", height: "450px", bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3, overflow: "hidden" }}>

      <Box sx={{  maxWidth: "150px", maxHeight: "150px", position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "5px", boxShadow: 2 }}>
        <IconButton size="small" onClick={() => handleZoom(1.2)}><AddIcon /></IconButton>
        <IconButton size="small" onClick={() => handleZoom(1 / 1.2)}><RemoveIcon /></IconButton>
        <IconButton size="small" onClick={handleReset}><RefreshIcon /></IconButton>
      </Box>


      <Box sx={{ maxWidth: "150px", maxHeight: "150px", position: "absolute", bottom: 10, left: "85%", transform: "translateX(-50%)", display: "grid", gap: 1, gridTemplateColumns: "repeat(3, 30px)", backgroundColor: "#fff", borderRadius: "8px", padding: "5px", boxShadow: 2 }}>
        <span></span>
        <IconButton size="small" onClick={() => handlePan(0, -20)}><ArrowUpwardIcon /></IconButton>
        <span></span>
        <IconButton size="small" onClick={() => handlePan(-20, 0)}><ArrowBackIcon /></IconButton>
        <span></span>
        <IconButton size="small" onClick={() => handlePan(20, 0)}><ArrowForwardIcon /></IconButton>
        <span></span>
        <IconButton size="small" onClick={() => handlePan(0, 20)}><ArrowDownwardIcon /></IconButton>
        <span></span>
      </Box>


      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", ml: "5px" }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 500 400"
        >

          <g transform={`translate(${250 + transform.translateX * transform.scale}, ${200 + transform.translateY * transform.scale}) scale(${transform.scale}) translate(-250, -200)`}>


            <image href="/goku.svg" width="100%" height="100%" />

            {Object.entries(highlightPositions).map(([key, value]) =>
              activeTags.includes(key) ? (
                Array.isArray(value) ? (
                  value.map((pos, index) => (
                    <Tooltip key={`${key}-${index}`} title={botMessageContent}>
                      <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(255,0,0,0.3)" />
                    </Tooltip>
                  ))
                ) : (
                  <Tooltip key={key} title={botMessageContent}>
                    <circle cx={value.x} cy={value.y} r="20" fill="rgba(255,0,0,0.3)" />
                  </Tooltip>
                )
              ) : null
            )}
          </g>
        </svg>
      </Box>

    </Box>
  );
};

export default HumanBody;
