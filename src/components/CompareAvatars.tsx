import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Tooltip, Chip, Button, Checkbox } from "@mui/material";


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
    } else if(filename.includes("hands")){
      return { taggedLocations: ["hands"], botMessageContent: "Possible issue detected in the hand area." };
    }
    return { taggedLocations: [], botMessageContent: "" };
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        This timeline spans a total of {id} months
      </Typography> */}
      <Box sx={{bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3, padding: 2, justifyContent: 'center', textAlign: 'center', maxWidth: '400px', display: "flex", flexDirection: 'row', alignItems: 'center'}}><Typography sx={{fontWeight: 'bold'}}>This timeline spans a total of{" "} <Chip color="primary" sx={{ fontWeight: "bold" }} />{" "} months.</Typography></Box>
      <Tooltip title="Please select only 2 avatars" arrow><Button sx={{position: "fixed", bottom: 14, right: 14, boxShadow: 3}} variant="contained">Compare Two Avatars</Button></Tooltip>
      {loading ? (
        <CircularProgress />
      ) : documents.length === 0 ? (
        <Typography>No avatars found for this ID.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", mt: "125px" }}>
          {documents.map((doc) => (
            <Box key={doc.name} sx={{ textAlign: "center" }}>
              <Box
                sx={{ width: "450px", height: "450px", position: "relative", cursor: "pointer", backgroundColor: "#f0f0f0", boxShadow: 3, borderRadius: "5px" }}
              >
                <Tooltip title="Please select only 2 avatars" arrow><Checkbox sx={{position: "fixed"}} /></Tooltip>
                <svg width="100%" height="100%" viewBox="0 0 500 400">
                  <image href="/goku.svg" width="100%" height="100%" />
                  {doc.taggedLocations.map((location) =>
                    highlightPositions[location] ? (
                      <Tooltip key={location} title={doc.botMessageContent} arrow>
                        <circle cx={highlightPositions[location].x} cy={highlightPositions[location].y} r="20" fill="rgba(255,0,0,0.3)" />
                      </Tooltip>
                    ) : null
                  )}
                </svg>
              </Box>

              <Typography variant="body2" sx={{ marginTop: "5px", fontWeight: "bold" }}>{doc.date}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
