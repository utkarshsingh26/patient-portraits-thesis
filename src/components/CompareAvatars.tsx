import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Tooltip, Chip, Button, Checkbox, IconButton, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import * as mammoth from 'mammoth';

const highlightPositions = {
  chest: { x: 250, y: 120 },
  hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
  face: { x: 250, y: 50 },
  crotch: { x: 250, y: 230 },
  butt: { x: 250, y: 250 },
  leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
  foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }]
};


const calculateMonthsBetweenDates = (documents) => {
  if (documents.length === 0) return 0;


  const sortedDocuments = documents.sort((a, b) => new Date(a.date) - new Date(b.date));


  const firstDate = new Date(sortedDocuments[0].date);
  const lastDate = new Date(sortedDocuments[sortedDocuments.length - 1].date);


  const monthsDifference =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (lastDate.getMonth() - firstDate.getMonth());

  return monthsDifference;
};

export default function CompareAvatar() {
  const { id } = useParams();
  const [documents, setDocuments] = useState<{ name: string; url: string; date: string; taggedLocations: string[]; botMessageContent: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedAvatars, setCheckedAvatars] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const monthsDifference = calculateMonthsBetweenDates(documents);

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
              const response = await fetch(url); 
              const blob = await response.blob();
              const arrayBuffer = await blob.arrayBuffer(); 
              const result = await mammoth.extractRawText({ arrayBuffer });
              const text = result.value;
              console.log(text,",<======");
              const { date } = extractDate(item.name);
              const { taggedLocations, botMessageContent } = extractTextData(text); 

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

  const extractTextData = (text: string) => {
    const taggedLocations = [];
    let botMessageContent = "";

    if (text.includes("Tagged Locations")) {
      const locationsSection = text.split("Tagged Locations")[1].split("Bot Message Content")[0];
      taggedLocations.push(...locationsSection.split("\n").filter(line => line.trim() && line.includes("•")).map(line => line.replace("•", "").trim()));
    }

    if (text.includes("Bot Message Content")) {
      botMessageContent = text.split("Bot Message Content")[1].trim();
    }

    return { taggedLocations, botMessageContent };
  };

  const handleCheckboxChange = (name: string) => {
    setCheckedAvatars(prev => {
      if (prev.includes(name)) {
        return prev.filter(item => item !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleCompareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box sx={{ bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3, padding: 2, justifyContent: 'center', textAlign: 'center', maxWidth: '400px', display: "flex", flexDirection: 'row', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold' }}>
          This timeline spans a total of{" "}
          <Chip color="primary" sx={{ fontWeight: "bold" }} label={`${monthsDifference} months`} />{" "}
        </Typography>
      </Box>
      <Tooltip title="Please select only 2 avatars" arrow>
        <Button 
          sx={{ position: "fixed", bottom: 14, right: 14, boxShadow: 3 }} 
          variant="contained"
          disabled={checkedAvatars.length !== 2}
          onClick={handleCompareClick} 
        >
          Compare Two Avatars
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="compare-avatars-modal"
        aria-describedby="compare-selected-avatars"
        sx={{ backgroundColor: "black" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1000px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "8px",
            p: 4,
            outline: "none",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleCloseModal} 
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {documents
              .filter(doc => checkedAvatars.includes(doc.name)) 
              .map((doc) => (
                <AvatarBox key={doc.name} doc={doc} checked={true} onCheckboxChange={() => {}} />
              ))}
          </Box>
        </Box>
      </Modal>

      {loading ? (
        <CircularProgress />
      ) : documents.length === 0 ? (
        <Typography>No avatars found for this ID.</Typography>
      ) : (
        <Box sx={{ display: "flex", gap: "16px", overflowX: "auto", justifyContent: "center", mt: "125px" }}>
          {documents.map((doc) => (
            <AvatarBox 
              key={doc.name} 
              doc={doc} 
              checked={checkedAvatars.includes(doc.name)}
              onCheckboxChange={() => handleCheckboxChange(doc.name)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

const AvatarBox = ({ doc, checked, onCheckboxChange }) => {
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
        <Tooltip title="Please select only 2 avatars" arrow>
          <Checkbox 
            sx={{ position: "absolute", top: 0, right: 0 }} 
            checked={checked}
            onChange={onCheckboxChange}
          />
        </Tooltip>
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
              {doc.taggedLocations.map((location) => {
                const positions = highlightPositions[location];
                if (!positions) return null; 

                return Array.isArray(positions) ? (
                  positions.map((pos, index) => (
                    <Tooltip key={`${location}-${index}`} title={doc.botMessageContent} arrow>
                      <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(255,0,0,0.3)" />
                    </Tooltip>
                  ))
                ) : (
                  <Tooltip key={location} title={doc.botMessageContent} arrow>
                    <circle cx={positions.x} cy={positions.y} r="20" fill="rgba(255,0,0,0.3)" />
                  </Tooltip>
                );
              })}
            </g>
          </svg>
        </Box>
      </Box>
      {/* <Typography variant="body2" sx={{ marginTop: "5px", fontWeight: "bold" }}>{doc.date}</Typography> */}
      <br></br>
      <Box sx={{bgcolor: "black", color: "white", width: "120px", borderRadius: "5px", textAlign: "center", display: "inline-block", marginTop: "3px"}}>
              {doc.date}
      </Box>
    </Box>
  );
};