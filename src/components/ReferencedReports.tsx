import React from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from 'react-router-dom';
import * as mammoth from 'mammoth';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';

interface ReportsReferencedProps {
  reports: string[];
}

const ReportsReferenced: React.FC<ReportsReferencedProps> = ({ reports }) => {

    // const {id} = useParams();

    // const extractCompleteText = async () =>{
    //     const storage = getStorage();
    //     const listRef = ref(storage, 'reports/');
    //     const allReports = await listAll(listRef);
    //     const concernedReports = allReports.items.filter(report => 
    //         report.name.includes(id)
    //     );
    //     return concernedReports
    // }

    //   React.useEffect(() => {
    //     extractCompleteText();
    //   }, [id]);

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
    </Box>
  );
};

export default ReportsReferenced;
