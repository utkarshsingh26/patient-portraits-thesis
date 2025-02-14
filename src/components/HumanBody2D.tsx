import React, { useRef, useState, useEffect } from "react";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';

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
    hands: [
      { x: 150, y: 200 },
      { x: 350, y: 200 }
    ],
    face: { x: 250, y: 50 },
    crotch: { x: 250, y: 230 },
    butt: { x: 250, y: 250 },
    leg: [
      { x: 200, y: 300 },
      { x: 300, y: 300 }
    ],
    foot: [
      { x: 200, y: 380 },
      { x: 300, y: 380 }
    ]
  };

  const handleZoomIn = () => {
    setTransform(prev => ({ ...prev, scale: prev.scale * 1.2 }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({ ...prev, scale: prev.scale / 1.2 }));
  };

  const handlePan = (direction: "left" | "right" | "up" | "down") => {
    const shift = 20;
    setTransform(prev => ({
      ...prev,
      translateX: direction === "left" ? prev.translateX - shift : direction === "right" ? prev.translateX + shift : prev.translateX,
      translateY: direction === "up" ? prev.translateY - shift : direction === "down" ? prev.translateY + shift : prev.translateY
    }));
  };

  const handleReset = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
    setActiveTags([]);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", height: "450px" }}>

      <ButtonGroup orientation="vertical" variant="contained" color="primary" sx={{ ml: 2 }}>
        <Button style={{height: 20, width: 30}} onClick={handleZoomIn}>{<AddIcon/>}</Button>
        <Button style={{height: 20, width: 30}} onClick={handleZoomOut}>{<RemoveIcon/>}</Button>
        <Button style={{height: 20, width: 30}} onClick={handleReset} color="secondary">{<RefreshIcon/>}</Button>
      </ButtonGroup>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 500 400"
        style={{ transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`, transition: "transform 0.3s ease" }}
      >
        <image href="/goku.svg" width="100%" height="100%" />
        {activeTags.includes('chest') && (
          <Tooltip
            title={botMessageContent}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#2196F3", 
                  color: "#FFFFFF",
                  fontSize: "14px",
                  borderRadius: "4px",
                  padding: "8px",
                },
              },
            }}
          >
            <circle cx={highlightPositions.chest.x} cy={highlightPositions.chest.y} r="30" fill="rgba(255,0,0,0.3)" />
          </Tooltip>
        )}
        {activeTags.includes('hands') && (
          <>
            <Tooltip
              title={botMessageContent}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    borderRadius: "4px",
                    padding: "8px",
                  },
                },
              }}
            >
              <circle cx={highlightPositions.hands[0].x} cy={highlightPositions.hands[0].y} r="20" fill="rgba(255,0,0,0.3)" />
            </Tooltip>
            <Tooltip
              title={botMessageContent}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    borderRadius: "4px",
                    padding: "8px",
                  },
                },
              }}
            >
              <circle cx={highlightPositions.hands[1].x} cy={highlightPositions.hands[1].y} r="20" fill="rgba(255,0,0,0.3)" />
            </Tooltip>
          </>
        )}
        {activeTags.includes('face') && (
          <Tooltip
            title={botMessageContent}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#2196F3",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  borderRadius: "4px",
                  padding: "8px",
                },
              },
            }}
          >
            <circle cx={highlightPositions.face.x} cy={highlightPositions.face.y} r="25" fill="rgba(255,0,0,0.3)" />
          </Tooltip>
        )}
        {activeTags.includes('crotch') && (
          <Tooltip
            title={botMessageContent}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#2196F3",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  borderRadius: "4px",
                  padding: "8px",
                },
              },
            }}
          >
            <circle cx={highlightPositions.crotch.x} cy={highlightPositions.crotch.y} r="20" fill="rgba(255,0,0,0.3)" />
          </Tooltip>
        )}
        {activeTags.includes('butt') && (
          <Tooltip
            title={botMessageContent}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#2196F3",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  borderRadius: "4px",
                  padding: "8px",
                },
              },
            }}
          >
            <circle cx={highlightPositions.butt.x} cy={highlightPositions.butt.y} r="25" fill="rgba(255,0,0,0.3)" />
          </Tooltip>
        )}
        {activeTags.includes('leg') && (
          <>
            <Tooltip
              title={botMessageContent}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    borderRadius: "4px",
                    padding: "8px",
                  },
                },
              }}
            >
              <circle cx={highlightPositions.leg[0].x} cy={highlightPositions.leg[0].y} r="25" fill="rgba(255,0,0,0.3)" />
            </Tooltip>
            <Tooltip
              title={botMessageContent}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    borderRadius: "4px",
                    padding: "8px",
                  },
                },
              }}
            >
              <circle cx={highlightPositions.leg[1].x} cy={highlightPositions.leg[1].y} r="25" fill="rgba(255,0,0,0.3)" />
            </Tooltip>
          </>
        )}
        {activeTags.includes('foot') && (
          <>
            <Tooltip
              title={botMessageContent}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    borderRadius: "4px",
                    padding: "8px",
                  },
                },
              }}
            >
              <circle cx={highlightPositions.foot[0].x} cy={highlightPositions.foot[0].y} r="15" fill="rgba(255,0,0,0.3)" />
            </Tooltip>
            <Tooltip
              title={botMessageContent}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#2196F3",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    borderRadius: "4px",
                    padding: "8px",
                  },
                },
              }}
            >
              <circle cx={highlightPositions.foot[1].x} cy={highlightPositions.foot[1].y} r="15" fill="rgba(255,0,0,0.3)" />
            </Tooltip>
          </>
        )}
      </svg>

      <ButtonGroup orientation="vertical" variant="contained" color="primary" sx={{ ml: 2 }} disableElevation>
  <Button style={{ height: 20, width: 30 }} sx={{ml: 2.5}} onClick={() => handlePan("up")}>
    <ArrowUpwardIcon />
  </Button>
  <ButtonGroup orientation="horizontal" variant="contained" color="primary">
    <Button style={{ height: 20, width: 30 }} onClick={() => handlePan("left")}>
      <ArrowBackIcon />
    </Button>
    <Button style={{ height: 20, width: 30 }} onClick={() => handlePan("right")}>
      <ArrowForwardIcon />
    </Button>
  </ButtonGroup>
  <Button style={{ height: 20, width: 30 }} sx={{ml: 2.5}} onClick={() => handlePan("down")}>
    <ArrowDownwardIcon />
  </Button>
      </ButtonGroup>

    </div>
  );
};

export default HumanBody;