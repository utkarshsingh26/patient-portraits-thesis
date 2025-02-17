import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import * as mammoth from 'mammoth';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Typography, Chip } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box', 
}));

export default function IndividiualPatientReports({ onExtractedText }: { onExtractedText: (text: string[]) => void }) {
  const { id } = useParams();
  const [fileURLs, setFileURLs] = React.useState<string[]>([]);
  const [docxText, setDocxText] = React.useState<string[]>([]);
  const [numberOfReports, setNumberOfReports] = React.useState(0);


  const downloadAndExtractText = async () => {
    if (!id) {
      console.error("No ID provided in the URL");
      return;
    }

    const storage = getStorage();
    const listRef = ref(storage, 'reports/');
    const allReports = await listAll(listRef);
    const concernedReports = allReports.items.filter(report => report.name.includes(id));
    setNumberOfReports(concernedReports.length);

    const downloadURLs = await Promise.all(concernedReports.map(report => getDownloadURL(report)));
    setFileURLs(downloadURLs);

    const extractedTexts: string[] = [];

    for (const url of downloadURLs) {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          const extractedText = await mammoth.extractRawText({ arrayBuffer: event.target.result });
          extractedTexts.push(extractedText.value);


          onExtractedText(extractedTexts);
        }
      };

      reader.readAsArrayBuffer(blob);
    }
  };

  React.useEffect(() => {
    downloadAndExtractText();
  }, [id]);

  return (
    <>
          {/* <Box
        sx={{
          width: 250,
          height: 50,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >There are X reports here</Box> */}
    <Box sx={{ width: "100%", padding: 2, bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3 }}>
    {/* <Typography sx={{textAlign: "center", fontWeight: "bold", color: "text.secondary"}}> There are{" "} <Box component="span" sx={{ display: "inline-block", width: "24px", height: "24px", lineHeight: "24px", borderRadius: "4px", bgcolor: "primary.main", color: "white", textAlign: "center", fontWeight: "bold", }} > {numberOfReports} </Box>{" "} reports in the patient's history. </Typography> */}
    <Typography sx={{ textAlign: "center", fontWeight: "bold", color: "text.secondary" }}> There are{" "} <Chip label={numberOfReports} color="primary" sx={{ fontWeight: "bold" }} />{" "} reports in the patient's history. </Typography>
    <br/>
      <Grid container spacing={2} justifyContent="center">
        {fileURLs.map((url, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ textAlign: "center" }}>
            <a href={url} download={`Document-${index}.docx`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <Paper sx={{ padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArticleOutlinedIcon sx={{ fontSize: 60, color: "black" }} />
              </Paper>
              <Box component="span" sx={{ display: "block", mt: 1, fontSize: 14, fontWeight: "bold" }}>
                Report {index + 1}
              </Box>
            </a>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
  
  
  
}
