import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Tooltip, Chip, Button, Checkbox, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";

const highlightPositions = {
  chest: { x: 250, y: 120 },
  hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
  face: { x: 250, y: 50 },
  crotch: { x: 250, y: 230 },
  butt: { x: 250, y: 250 },
  leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
  foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }]
};

export default function CompareAvatar() {
  const { id } = useParams();
  const [documents, setDocuments] = useState<{ name: string; url: string; date: string; taggedLocations: string[]; botMessageContent: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDocuments = async () => {
      try {
        const storage = getStorage();
        const avatarsRef = ref(storage, "avatars/");
        const fileList = await listAll(avatarsRef);

        const matchingFiles = await Promise.all(
          fileList.items
            .filter((item) => item.name.includes(id as string))
            .map(async (item) => {
              const url = await getDownloadURL(item);
              const { date } = extractDate(item.name);
              const { taggedLocations, botMessageContent } = extractTextData(item.name);
              return { name: item.name, url, date, taggedLocations, botMessageContent };
            })
        );

        setDocuments(matchingFiles);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  const extractDate = (filename: string) => {
    const match = filename.match(/_(\d{4}-\d{2}-\d{2})/);
    return { date: match ? match[1] : "0000-00-00" };
  };

  const extractTextData = (filename: string) => {
    if (filename.includes("chest")) {
      return { taggedLocations: ["chest"], botMessageContent: "Abnormality detected in chest scan." };
    } else if (filename.includes("crotch")) {
      return { taggedLocations: ["crotch"], botMessageContent: "Possible issue detected in the pelvic area." };
    } else if (filename.includes("hands")) {
      return { taggedLocations: ["hands"], botMessageContent: "Possible issue detected in the hand area." };
    }
    return { taggedLocations: [], botMessageContent: "" };
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box sx={{ bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3, padding: 2, justifyContent: 'center', textAlign: 'center', maxWidth: '400px', display: "flex", flexDirection: 'row', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold' }}>This timeline spans a total of{" "} <Chip color="primary" sx={{ fontWeight: "bold" }} />{" "} months.</Typography>
      </Box>
      <Tooltip title="Please select only 2 avatars" arrow>
        <Button sx={{ position: "fixed", bottom: 14, right: 14, boxShadow: 3 }} variant="contained">Compare Two Avatars</Button>
      </Tooltip>
      {loading ? (
        <CircularProgress />
      ) : documents.length === 0 ? (
        <Typography>No avatars found for this ID.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", mt: "125px" }}>
          {documents.map((doc) => (
            <AvatarBox key={doc.name} doc={doc} />
          ))}
        </Box>
      )}
    </Box>
  );
}


const AvatarBox = ({ doc }) => {
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });


  const handleZoom = (factor: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(prev.scale * factor, 3))
    }));
  };


  const handlePan = (dx: number, dy: number) => {
    setTransform((prev) => ({
      ...prev,
      translateX: prev.translateX + dx / prev.scale,
      translateY: prev.translateY + dy / prev.scale
    }));
  };


  const handleReset = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{ width: "450px", height: "450px", position: "relative", cursor: "pointer", backgroundColor: "#f0f0f0", boxShadow: 3, borderRadius: "5px", overflow: "hidden" }}
      >

        <Box sx={{ maxWidth: "150px", maxHeight: "150px", position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "5px", boxShadow: 2 }}>
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


        <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 500 400"
          >
            <g transform={`translate(${250 + transform.translateX * transform.scale}, ${200 + transform.translateY * transform.scale}) scale(${transform.scale}) translate(-250, -200)`}>
              <image href="/goku.svg" width="100%" height="100%" />
              {doc.taggedLocations.map((location) =>
                highlightPositions[location] ? (
                  <Tooltip key={location} title={doc.botMessageContent} arrow>
                    <circle cx={highlightPositions[location].x} cy={highlightPositions[location].y} r="20" fill="rgba(255,0,0,0.3)" />
                  </Tooltip>
                ) : null
              )}
            </g>
          </svg>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ marginTop: "5px", fontWeight: "bold" }}>{doc.date}</Typography>
    </Box>
  );
};