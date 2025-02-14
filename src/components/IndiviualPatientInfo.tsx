import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import { Box, Typography, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

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
    <Card sx={{ width: 250, bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3  }}>
    <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", alignItems: "center"}}>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, textAlign: "center", fontWeight: "bold" }}>
        Patient Snippet
      </Typography>
      <br/>
      {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{patient.name}</Typography> */}
      <Box sx={{bgcolor: "primary.main", color: "white", width: "100px", borderRadius: "5px", textAlign: "center"}}>{patient.name}</Box>
      <br/>
      <Typography variant="body2" sx={{display: "inline-block"}}>
      <b>Age</b>: <Box sx={{bgcolor: "black", color: "white", width: "30px", borderRadius: "5px", textAlign: "center", display: "inline-block"}}>
        { patient.age}
        </Box>
        <br />
        <b>Last Visit</b>: <Box sx={{bgcolor: "black", color: "white", width: "80px", borderRadius: "5px", textAlign: "center", display: "inline-block", marginTop: "3px"}}>
        { patient.lastVisit}
        </Box>
        <br/>
        <b>Next Visit</b>: <Box sx={{bgcolor: "black", color: "white", width: "80px", borderRadius: "5px", textAlign: "center", display: "inline-block", marginTop: "3px"}}>
        { patient.nextVisit}
        </Box>
      </Typography>
    </CardContent>

  </Card>
  );
}
