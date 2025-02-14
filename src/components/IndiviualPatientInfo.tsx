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
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, textAlign: "center" }}>
        Patient Snippet
      </Typography>
      <br/>
      {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{patient.name}</Typography> */}
      <Box sx={{bgcolor: "black", color: "white", maxWidth: "80px", borderRadius: "5px", textAlign: "center"}}>{patient.name}</Box>
      <br/>
      <Typography variant="body2">
      <Box sx={{bgcolor: "primary.main", color: "white", maxWidth: "40px", borderRadius: "5px", textAlign: "center"}}>
        {patient.age}
        </Box>
        <br />
        Last Visit: {patient.lastVisit}
        <br/>
        Next Scheduled Visit: {patient.nextVisit}
      </Typography>
    </CardContent>

  </Card>
  );
}
