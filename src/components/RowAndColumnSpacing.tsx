import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import * as mammoth from 'mammoth';

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

export default function RowAndColumnSpacing({ onExtractedText }: { onExtractedText: (text: string[]) => void }) {
  const { id } = useParams();
  const [fileURLs, setFileURLs] = React.useState<string[]>([]);
  const [docxText, setDocxText] = React.useState<string[]>([]);

  const downloadAndExtractText = async () => {
    if (!id) {
      console.error("No ID provided in the URL");
      return;
    }

    const storage = getStorage();
    const listRef = ref(storage, 'reports/');
    const allReports = await listAll(listRef);
    const concernedReports = allReports.items.filter(report => report.name.includes(id));

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
<Box sx={{ width: "100%", padding: 2 }}>
  <Grid container spacing={2}>
    {fileURLs.map((url, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Item sx={{ width: "100%" }}>  
          <Button
            variant="contained"
            color="primary"
            href={url}
            download={`Document-${index}.docx`}
            target="_blank"
            sx={{ mt: 2, width: "120%", fontSize: "12px", padding: "15px" }} 
          >
            Document {index + 1}
          </Button>
        </Item>
      </Grid>
    ))}
  </Grid>
</Box>

  );
}
