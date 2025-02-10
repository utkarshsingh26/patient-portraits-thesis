import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import { Box, Typography, CircularProgress } from '@mui/material';

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
    <Box mt={3} p={2}>
      <Typography><strong>Name:</strong> {patient.name}</Typography>
      <Typography><strong>Age:</strong> {patient.age}</Typography>
      <Typography><strong>Last Visit:</strong> {patient.lastVisit}</Typography>
      <Typography><strong>Next Visit:</strong> {patient.nextVisit}</Typography>
    </Box>
  );
}
