import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Tooltip } from "@mui/material";
import Mammoth from "mammoth";

export default function CompareAvatar() {
  const { id } = useParams();
  const [documents, setDocuments] = useState<{ name: string; url: string; date: string; counter: number; text: string }[]>([]);
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
            .filter((item) => item.name.includes(id as string) && item.name.endsWith(".docx"))
            .map(async (item) => {
              const url = await getDownloadURL(item);
              const { date, counter } = extractDateAndCounter(item.name);
              const text = await extractTextFromDocx(url);
              return { name: item.name, url, date, counter, text };
            })
        );

        // Sort documents by date first, then by counter
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

  // Function to extract date and counter from filename
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

  // Function to extract text from a .docx file
  const extractTextFromDocx = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const result = await Mammoth.extractRawText({ arrayBuffer });
      return result.value.trim() || "No text extracted.";
    } catch (error) {
      console.error("Error extracting text from DOCX:", error);
      return "Error reading file.";
    }
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
            <Box key={doc.name} sx={{ textAlign: "center", maxWidth: "450px" }}>
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

              {/* Show extracted date below each box */}
              <Typography variant="body2" sx={{ marginTop: "5px", fontWeight: "bold" }}>
                {doc.date} {doc.counter > 0 ? `(${doc.counter})` : ""}
              </Typography>

              {/* Show extracted text below each box */}
              <Typography
                variant="body2"
                sx={{
                  marginTop: "5px",
                  padding: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                  maxHeight: "100px",
                  overflowY: "auto",
                  textAlign: "left",
                }}
              >
                {doc.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
