import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from '@mui/material';
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase/firebaseConfig';

export default function FloatingActionButtonSize() {
  const [open, setOpen] = React.useState(false);

  const refreshButton = () => {
    window.location.reload();
  }
  
  // State to manage form inputs
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState<number | ''>('');
  const [lastVisit, setLastVisit] = React.useState('');
  const [nextVisit, setNextVisit] = React.useState('');
  const [reports, setReports] = React.useState<FileList | null>(null);

  // State to track upload progress
  const [uploadProgress, setUploadProgress] = React.useState<number[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uploadFile = (file: File, index: number, patientId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      // Generate a unique file name with patientId and timestamp
      const todayInPhoenix = new Date().toLocaleString("en-US", { timeZone: "America/Phoenix" });
      const dateObjInPhoenix = new Date(todayInPhoenix);  // Convert to Date object
      
      const year = dateObjInPhoenix.getFullYear();
      const month = (dateObjInPhoenix.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = dateObjInPhoenix.getDate().toString().padStart(2, '0');
      
      // Format as YYYY-MM-DD
      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate); // Output example: 2024-10-05
      const uniqueFileName = `${patientId}_${formattedDate}_${file.name}`;

      const storageRef = ref(storage, `reports/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate upload progress as a percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            updatedProgress[index] = progress;
            return updatedProgress;
          });
        },
        (error) => {
          reject(error);
        },
        async () => {
          // Get the download URL after upload completes
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async () => {
    const db = getFirestore(app); // Initialize Firestore

    try {
      // First, add the patient document to Firestore to get the patientId
      const patientDoc = await addDoc(collection(db, "patients"), {
        name,
        age,
        lastVisit,
        nextVisit,
      });
      const patientId = patientDoc.id; // Get the Firestore-generated patient ID

      // If there are files to upload, upload them and get their download URLs
      const reportURLs: string[] = [];
      if (reports) {
        const uploadPromises = Array.from(reports).map((file, index) => uploadFile(file, index, patientId));
        const uploadedURLs = await Promise.all(uploadPromises);
        reportURLs.push(...uploadedURLs);
      }

      // Update the patient document with the uploaded file URLs
      await addDoc(collection(db, "patients", patientId, "reports"), {
        reportURLs,
      });

      // Close the dialog after successful submission
      handleClose();

      // Clear form state
      setName('');
      setAge('');
      setLastVisit('');
      setNextVisit('');
      setReports(null);
      setUploadProgress([]);  // Reset upload progress after submission

    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab size="medium" color="secondary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Patient Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            variant="outlined"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Last Visit"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            value={lastVisit}
            onChange={(e) => setLastVisit(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Next Scheduled Visit"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            value={nextVisit}
            onChange={(e) => setNextVisit(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Upload Reports"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{ multiple: true }}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) {
                setReports(target.files);
                setUploadProgress(Array(target.files.length).fill(0)); // Initialize upload progress
              }
            }}
          />

          {/* Display progress bars for each file */}
          {reports && Array.from(reports).map((file, index) => (
            <div key={file.name}>
              <p>{file.name}</p>
              <LinearProgress variant="determinate" value={uploadProgress[index] || 0} />
              <p>{Math.round(uploadProgress[index] || 0)}%</p>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={() => {
            handleSubmit() 
            refreshButton()
          }} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
