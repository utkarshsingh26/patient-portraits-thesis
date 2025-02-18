import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Tooltip } from "@mui/material";

export default function CompareAvatar() {
  const { id } = useParams();
  const [documents, setDocuments] = useState<{ name: string; url: string; date: string; counter: number }[]>([]);
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
              const { date, counter } = extractDateAndCounter(item.name);
              return { name: item.name, url, date, counter };
            })
        );


        matchingFiles.sort((a, b) => {
          if (a.date === b.date) return a.counter - b.counter;
          return a.date.localeCompare(b.date);
        });

        setDocuments(matchingFiles);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);


  const extractDateAndCounter = (filename: string) => {
    const match = filename.match(/_(\d{4}-\d{2}-\d{2})(?:_(\d+))?/);
    if (match) {
      return {
        date: match[1], 
        counter: match[2] ? parseInt(match[2], 10) : 0, 
      };
    }
    return { date: "0000-00-00", counter: 0 };
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Compare Avatars - Files for ID: {id}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : documents.length === 0 ? (
        <Typography>No avatars found for this ID.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
            mt: "50px",
          }}
        >
          {documents.map((doc) => (
            <Box key={doc.name} sx={{ textAlign: "center" }}>
              <Tooltip title={doc.name} arrow>
                <Box
                  sx={{
                    width: "450px",
                    height: "450px",
                    borderRadius: "8px",
                    boxShadow: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    backgroundColor: "#f0f0f0",
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 },
                  }}
                  onClick={() => window.open(doc.url, "_blank")}
                >

                  <svg width="100%" height="100%" viewBox="0 0 250 250">
                    <image href="/goku.svg" width="100%" height="100%" />
                  </svg>
                </Box>
              </Tooltip>

              <Typography variant="body2" sx={{ marginTop: "5px", fontWeight: "bold" }}>

                {doc.date}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
