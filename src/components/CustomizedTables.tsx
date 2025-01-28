import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Define the Patient type based on Firestore document structure
interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  nextVisit: string;
  selectedPatientId: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables() {

  const refreshButton = () => {
    window.location.reload();
  }

  const [open, setOpen] = React.useState(false);

  const handleClick = (patient: Patient) =>{
    setName(patient.name);
    setAge(patient.age);
    setLastVisit(patient.lastVisit);
    setNextVisit(patient.nextVisit);
    setSelectedPatientId(patient.id);
    setOpen(true);
  }

  const modifyPatient = async() =>{
    const db = getFirestore(app);
    var documentRef = doc(db, "patients", selectedPatientId);
    
    await updateDoc(documentRef,{
      name: name,
      age: age,
      lastVisit: lastVisit,
      nextVisit: nextVisit
    })

    handleClose();
  }

  const deletePatient = async() => {
    const db = getFirestore(app);
    var documentRef = doc(db, "patients", selectedPatientId);

    await deleteDoc(documentRef)
  }

  const handleClose = () => {
    setOpen(false);
  }

  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState<number |''>('');
  const [lastVisit, setLastVisit] = React.useState('');
  const [nextVisit, setNextVisit] = React.useState('');
  const [selectedPatientId, setSelectedPatientId] = React.useState('');

  const [documents, setDocuments] = useState<Patient[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "patients"));
      const docs: Patient[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Patient)); 
      setDocuments(docs);
    };

    fetchData();
  }, []);

  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Patient ID</StyledTableCell>
            <StyledTableCell align="right">Patient Name</StyledTableCell>
            <StyledTableCell align="right">Age</StyledTableCell>
            <StyledTableCell align="right">Last Visit</StyledTableCell>
            <StyledTableCell align="right">Next Scheduled Visit</StyledTableCell>
            <StyledTableCell align="right">Make Changes</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((document) => (
            <StyledTableRow key={document.id}>
              <StyledTableCell component="th" scope="row">
                <Link to={`/avatar/${document.id}`}>{document.id}</Link>
              </StyledTableCell>
              <StyledTableCell align="right">{document.name}</StyledTableCell>
              <StyledTableCell align="right">{document.age}</StyledTableCell>
              <StyledTableCell align="right">{document.lastVisit}</StyledTableCell>
              <StyledTableCell align="right">{document.nextVisit}</StyledTableCell>
              <StyledTableCell align="right"><Button onClick={() => handleClick(document)} variant="contained" endIcon={<ChangeCircleIcon />}>MODIFY</Button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modify</DialogTitle>
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
        </DialogContent>
        <DialogActions>
        <IconButton onClick={() =>{
          deletePatient();
          refreshButton();
        }} aria-label="delete">
  <DeleteIcon />
</IconButton>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={() =>{
            modifyPatient();
            refreshButton();
          }} color="primary">Change</Button>
        </DialogActions>
      </Dialog>


    </div>

  );
}
