// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import app from '../firebase/firebaseConfig';
// import { Box, Typography, CircularProgress, Chip, Paper } from '@mui/material';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import { color } from 'framer-motion';

// interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   lastVisit: string;
//   nextVisit: string;
// }

// export default function IndividualPatientInfo() {
//   const { id } = useParams<{ id: string }>();
//   const [patient, setPatient] = useState<Patient | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPatient = async () => {
//       if (id) {
//         const db = getFirestore(app);
//         const docRef = doc(db, "patients", id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setPatient({ id: docSnap.id, ...docSnap.data() } as Patient);
//         }
//       }
//       setLoading(false);
//     };
//     fetchPatient();
//   }, [id]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (!patient) {
//     return <Typography variant="h6">Patient not found</Typography>;
//   }

//   return (
//     <Card sx={{ width: "100%", height: "100%", bgcolor: "#FFFAFA", borderRadius: "5px", boxShadow: 3}}>
//     <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", alignItems: "center"}}>
//     <Typography sx={{ display: "inline-block", fontWeight: "bold", "color": "black", marginLeft: -48, fontSize: 20, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"}}> Patient Snippet </Typography> 
//       <br/>
//       <Typography sx={{ display: "inline-block", fontWeight: "bold", "color": "grey"}}> {patient.name} </Typography>
//       <br/>
//       <Typography variant="body2" sx={{display: "inline-block"}}>
//         <Typography sx={{ display: "inline-block", "color": "grey"}}> Last Visit: </Typography> 
//         <Typography sx={{ display: "inline-block", fontWeight: "bold", "color": "grey", marginLeft: 1}}> {patient.lastVisit} </Typography>
//         <br/>

//         <Typography sx={{ display: "inline-block", "color": "grey"}}> Age: </Typography> 
//         <Typography sx={{ display: "inline-block", fontWeight: "bold", "color": "grey", marginLeft: 1}}>  {patient.age} </Typography>
//         <br />
//         <Typography sx={{ display: "inline-block", "color": "grey"}}> Next Visit: </Typography>  
//         <Typography sx={{ display: "inline-block", fontWeight: "bold", "color": "grey", marginLeft: 1}}> {patient.nextVisit} </Typography>
//       </Typography>
//     </CardContent>

//   </Card>
//   );
// }

// import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import { Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Card, CardContent } from '@mui/material';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  nextVisit: string;
}

export default function IndividualPatientInfo() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const db = getFirestore(app);
        const docRef = doc(db, "patients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient({ id: docSnap.id, ...docSnap.data() } as Patient);
        }
      }
      setLoading(false);
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!patient) {
    return <Typography variant="h6">Patient not found</Typography>;
  }

  return (
    <Card sx={{ width: "100%", height: "100%", bgcolor: "#FFFAFA", borderRadius: "5px", boxShadow: 3 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Typography sx={{ display: "inline-block", fontWeight: "bold", "color": "black", marginLeft: -48, fontSize: 20, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"}}> Patient Snippet </Typography> 

        <TableContainer component={Paper} sx={{ maxWidth: 600, boxShadow: 2,  mt: 1, overflow: "auto" }}>
          <Table>
            {/* <TableHead>
              <TableRow sx={{ backgroundColor: "#E0E0E0" }}> 
                <TableCell sx={{ fontWeight: "bold" }}>Field</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody style={{paddingBottom: 20}}>
              {[
                { label: "Name", value: patient.name },
                { label: "Age", value: patient.age },
                { label: "Last Visit", value: patient.lastVisit },
                { label: "Next Visit", value: patient.nextVisit }
              ].map((row, index) => (
                <TableRow key={row.label} sx={{ backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#E3E3E3" }}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell><b>{row.value}</b></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}


