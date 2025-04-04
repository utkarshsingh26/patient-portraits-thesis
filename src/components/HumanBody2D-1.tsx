import React, { useRef, useState, useEffect } from "react";
import { Tooltip, Box, IconButton } from "@mui/material";
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
  const [bodyPartTooltips, setBodyPartTooltips] = useState<Record<string, string>>({});

  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    setActiveTags(taggedLocations);
  }, [taggedLocations]);

  useEffect(() => {
    const fetchBodyPartTooltips = async () => {
      if (!botMessageContent || taggedLocations.length === 0) return;

      const bodyPartsPrompt = `Extract only the relevant information for each of the following body parts from the given text. 
Return a JSON object where each key is a body part and its value is a short, clear explanation. 
Only include body parts that are mentioned in the text.

Body parts: ${taggedLocations.join(", ")}

Text: ${botMessageContent}`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              { role: "system", content: "You are a medical assistant helping to break down text by body parts." },
              { role: "user", content: bodyPartsPrompt },
            ],
            temperature: 0.2,
          }),
        });

        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        setBodyPartTooltips(parsed);
      } catch (error) {
        console.error("Error fetching body part tooltips:", error);
      }
    };

    fetchBodyPartTooltips();
  }, [botMessageContent, taggedLocations]);

  const highlightPositions = {
    chest: { x: 250, y: 120 },
    hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
    face: { x: 250, y: 50 },
    crotch: { x: 250, y: 230 },
    butt: { x: 250, y: 250 },
    leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
    foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }],
    liver: { x: 220, y: 150 },
    spleen: { x: 270, y: 145 },
    bowel: { x: 230, y: 175 },
    bladder: { x: 250, y: 175 },
    kidney: { x: 260, y: 170 },
    pancreas: { x: 250, y: 150 },
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
    setActiveTags([]);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "#FFFAFA", borderRadius: "5px", boxShadow: 3, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0.5,
          alignItems: "center",
          justifyContent: "flex-end",
          maxWidth: "300px",
          maxHeight: "40px",
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "4px",
          boxShadow: 2,
        }}
      >
        <IconButton size="small" onClick={handleReset}>
          <RefreshIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleZoom(1.2)}>
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleZoom(1 / 1.2)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handlePan(0, -20)}>
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handlePan(0, 20)}>
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handlePan(-20, 0)}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handlePan(20, 0)}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", ml: "5px" }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 25 500 400"
          style={{ fill: "white" }}
        >
          <g transform={`translate(${250 + transform.translateX * transform.scale}, ${200 + transform.translateY * transform.scale}) scale(${transform.scale}) translate(-250, -200)`}>
            <image href="/Silhouette_of_a_woman.svg" width="100%" height="100%" />
            {Object.entries(highlightPositions).map(([key, value]) =>
              activeTags.includes(key) ? (
                Array.isArray(value) ? (
                  value.map((pos, index) => (
                    <Tooltip key={`${key}-${index}`} title={bodyPartTooltips[key] || key}>
                      <circle cx={pos.x} cy={pos.y} r="10" fill="#800020" stroke="#DC143C" strokeWidth="2" />
                    </Tooltip>
                  ))
                ) : (
                  <Tooltip key={key} title={bodyPartTooltips[key] || key}>
                    <circle cx={value.x} cy={value.y} r="10" fill="#800020" stroke="#DC143C" strokeWidth="2" />
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