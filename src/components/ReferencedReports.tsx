import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import * as mammoth from "mammoth";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

interface ReportsReferencedProps {
  reports: string[];
  botMessageContent: string;
}

const fetchHighlightedText = async (text: string, highlight: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an assistant that highlights relevant text. Wrap highlighted parts with [[HIGHLIGHT]] and [[/HIGHLIGHT]].",
        },
        {
          role: "user",
          content: `Highlight parts of this text related to: "${highlight}"\n\n${text}`,
        },
      ],
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || text;
};

const ReportsReferenced: React.FC<ReportsReferencedProps> = ({ reports, botMessageContent }) => {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
  const [extractedText, setExtractedText] = useState<string | null>(null);
  // @ts-ignore
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const extractTextFromReports = async () => {
      if (reports.length > 0) {
        setLoading(true);
        try {
          const storage = getStorage();
          const listRef = ref(storage, "reports/");
          const allReports = await listAll(listRef);
          //@ts-ignore
          const concernedReports = allReports.items.filter(report => report.name.includes(id));

          let reportsToShow: any[] = [];
          for (let i = 0; i < reports.length; i++) {
            reportsToShow.push(concernedReports.filter(report => report.name.includes(reports[i])));
          }

          const downloadURLs = await Promise.all(
            reportsToShow.map(report => (report[0] ? getDownloadURL(report[0]) : Promise.resolve(null)))
          );

          let extractedTexts = "";

          for (const url of downloadURLs) {
            if (!url) continue;
            const response = await fetch(url);
            const blob = await response.blob();

            const text = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = async event => {
                if (event.target?.result instanceof ArrayBuffer) {
                  try {
                    const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
                    resolve(result.value);
                  } catch (error) {
                    reject(error);
                  }
                }
              };
              reader.onerror = error => reject(error);
              reader.readAsArrayBuffer(blob);
            });

            extractedTexts += text;
          }

          setExtractedText(extractedTexts || "Failed to extract text from the report.");
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      }
    };

    extractTextFromReports();
  }, [reports, id]);

  useEffect(() => {
    if (extractedText && botMessageContent) {
      fetchHighlightedText(extractedText, botMessageContent).then(highlighted => {
        setHighlightedText(highlighted);
        setLoading(false);
      });
    }
  }, [extractedText, botMessageContent]);

  const renderHighlightedText = (text: string) => {
    return text.split(/(\[\[HIGHLIGHT\]\](.*?)\[\[\/HIGHLIGHT\]\])/g).map((part, index) =>
      part.startsWith("[[HIGHLIGHT]]") ? (
        <span key={index} style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>
          {part.replace("[[HIGHLIGHT]]", "").replace("[[/HIGHLIGHT]]", "")}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Box sx={{ height: "100%", width: "100%", bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3, padding: 2}}>
      <Typography sx={{textAlign: "center", fontWeight: "bold", marginLeft: -42, color: "black", fontSize: 20, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}> Reports Referenced </Typography>
      <br />
      {reports.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {reports.map((report, index) => (
            <Box
              key={index}
              sx={{
                // backgroundColor: "primary.main",
                // color: "white",
                // padding: 1,
                // borderRadius: 1,
                // boxShadow: 2,
                // minWidth: "120px",
                textAlign: "center"
              }}
            >
              {/* <Typography variant="body2" sx={{fontWeight: "bold"}}>{report}</Typography> */}
              <Paper sx={{ borderRadius: 400, mt: '20%', display: "inline-block", backgroundColor: "#FFFAFA", color:"primary.main", padding: "4px 8px", fontWeight: "bold", boxShadow: 0, border: "1px solid #FFFAFA" }}>
                      {report}
                    </Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
        sx={{
          // backgroundColor: "primary.main",
          // color: "white",
          // padding: 1,
          // borderRadius: 1,
          // boxShadow: 2,
          minWidth: "120px",
          textAlign: "center"
        }}
      >
        {/* <Typography variant="body2">No reports referenced.</Typography> */}
        {/* <Chip color="primary" sx={{ fontWeight: "bold"}} label={`No reports referenced.`} />{" "} */}
                    <Paper sx={{ borderRadius: 400, mt: '20%', display: "inline-block", backgroundColor: "#FFFAFA", color:"primary.main", padding: "4px 8px", fontWeight: "bold", boxShadow: 0, border: "1px solid #FFFAFA" }}>
                      No reports referenced
                    </Paper>
      </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2} sx={{overflow: 'hidden'}}>
          <CircularProgress />
        </Box>
      ) : (
        highlightedText && (
          <Paper
            sx={{
              backgroundColor: "white",
              color: "black",
              padding: 2,
              marginTop: 2,
              overflowY: "auto",
              height: 400,
              // display: "flex",
              // flexDirection: "column"
            }}
          >
            <Typography
              variant="body1"
              component="pre"
              sx={{ whiteSpace: "pre-wrap", overflow: "auto" }}
            >
              {renderHighlightedText(highlightedText)}
            </Typography>
          </Paper>
        )
      )}
    </Box>
  );
};

export default ReportsReferenced;