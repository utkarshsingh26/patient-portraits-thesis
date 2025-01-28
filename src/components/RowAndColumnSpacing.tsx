import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';

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

export default function RowAndColumnSpacing() {
  const { id } = useParams();
  const [fileURLs, setFileURLs] = React.useState<string[]>([]);

  const download = async () => {
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
  };

  React.useEffect(() => {
    download();
  }, [id]);

  const extractName = (url: string): string => {
    const lastIndex1 = url.lastIndexOf('_') + 1;
    const lastIndex2 = url.lastIndexOf('.') + 1;
    const newName = url.substring(lastIndex1, lastIndex2)
    return newName || url;  
  };
  

  return (
      <Box sx={{ width: '100%', padding: 2 }}>
        <Grid container spacing={2}>
          {fileURLs.map((url, index) => {
            const filename = extractName(url);  // Use extractName to get a meaningful part of the URL
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <iframe 
                    src={url} 
                    style={{ width: '100%', height: '99px', border: 'none', overflow: 'hidden' }}
                    title={`PDF Document ${index}`}
                    allowFullScreen>
                  </iframe>
                  <Button
                    variant="contained"
                    color="primary"
                    href={url}
                    download={`Document-${index}.pdf`}
                    target="_blank"
                    sx={{ mt: 2, width: '100%', maxWidth: 'calc(100% - 16px)' }}
                  >
                    Open {filename}
                  </Button>
                </Item>
              </Grid>
            );
          })}
        </Grid>
      </Box>

  );
}
