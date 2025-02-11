import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import * as mammoth from "mammoth";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

interface ReportsReferencedProps {
  reports: string[];
  botMessageContent: string;
}

const ReportsReferenced: React.FC<ReportsReferencedProps> = ({ reports, botMessageContent }) => {
  const { id } = useParams<{ id: string }>();
  const [extractedText, setExtractedText] = useState<string | null>(null);

  useEffect(() => {
    const extractTextFromReports = async () => {
      if (reports.length > 0) {
        const storage = getStorage();
        const listRef = ref(storage, "reports/");
        const allReports = await listAll(listRef);
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

        console.log(extractedTexts, "<======");
        setExtractedText(extractedTexts || "Failed to extract text from the report.");
      }
    };

    extractTextFromReports();
  }, [reports, id]);

  return (
    <Box>
      <Typography variant="h6">Reports Referenced:</Typography>
      {reports.length > 0 ? (
        <ul>
          {reports.map((report, index) => (
            <li key={index}>{report}</li>
          ))}
        </ul>
      ) : (
        <Typography variant="body2">No reports referenced.</Typography>
      )}

      {extractedText && (
        <Paper
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            padding: 2,
            marginTop: 2,
            overflow: "auto",
          }}
        >
          <Typography
            variant="body1"
            component="pre"
            sx={{ whiteSpace: "pre-wrap", overflow: "auto", maxHeight: 200 }}
          >
            {extractedText}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ReportsReferenced;
