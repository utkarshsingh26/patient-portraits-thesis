import React from "react";
import { Box, Typography } from "@mui/material";

interface ReportsReferencedProps {
  reports: string[];
}

const ReportsReferenced: React.FC<ReportsReferencedProps> = ({ reports }) => {
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
