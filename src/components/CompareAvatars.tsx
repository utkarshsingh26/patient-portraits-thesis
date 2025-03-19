// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import { Box, CircularProgress, Typography, Tooltip, Button, Checkbox, Modal, IconButton, Chip } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { format } from "date-fns";

// const highlightPositions = {
//   chest: { x: 250, y: 120 },
//   hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
//   face: { x: 250, y: 50 },
//   crotch: { x: 250, y: 230 },
//   butt: { x: 250, y: 250 },
//   leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
//   foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }]
// };

// export default function CompareAvatar() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [savedStates, setSavedStates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [checkedAvatars, setCheckedAvatars] = useState<string[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchSavedStates = async () => {
//       try {
//         const db = getFirestore();
//         const savedStatesCollection = collection(db, "savedStates");
//         const q = query(savedStatesCollection, where("patientId", "==", id));
//         const querySnapshot = await getDocs(q);

//         const states = [];
//         querySnapshot.forEach((doc) => {
//           states.push({ id: doc.id, ...doc.data() });
//         });

//         setSavedStates(states);
//       } catch (error) {
//         console.error("Error fetching saved states:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavedStates();
//   }, [id]);

//   // Calculate start and end dates
//   const calculateDateRange = () => {
//     if (savedStates.length === 0) return { startDate: null, endDate: null };

//     const sortedStates = savedStates.sort(
//       (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//     );

//     const startDate = sortedStates[0].timestamp;
//     const endDate = sortedStates[sortedStates.length - 1].timestamp;

//     return { startDate, endDate };
//   };

//   const { startDate, endDate } = calculateDateRange();

//   const handleAvatarClick = (savedState) => {
//     navigate(`/avatar/${id}`, { state: { savedState } });
//   };

//   const handleCheckboxChange = (id: string) => {
//     setCheckedAvatars((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleCompareClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <Box sx={{ paddingTop: "20px", paddingLeft: "20px" }}>
//       {startDate && endDate && (
//         <Box
//           sx={{
//             bgcolor: "#f6f6f6",
//             borderRadius: "5px",
//             boxShadow: 3,
//             padding: 2,
//             maxWidth: "400px",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}>
//             Key dates in this timeline
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Chip
//               label={`Start: ${format(new Date(startDate), "yyyy-MM-dd")}`}
//               color="primary"
//               sx={{ fontWeight: "bold" }}
//             />
//             <Chip
//               label={`End: ${format(new Date(endDate), "yyyy-MM-dd")}`}
//               color="error"
//               sx={{ fontWeight: "bold", ml: 12 }}
//             />
//           </Box>
//         </Box>
//       )}

//       {loading ? (
//         <CircularProgress />
//       ) : savedStates.length === 0 ? (
//         <Typography>No saved states found for this patient.</Typography>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             gap: "16px",
//             overflowX: "auto",
//             justifyContent: "flex-start",
//             mt: "125px",
//             paddingLeft: "12px",
//             marginTop: "100px",
//             "&::-webkit-scrollbar": {
//               height: "6px",
//             },
//             "&::-webkit-scrollbar-thumb": {
//               backgroundColor: "#888",
//               borderRadius: "4px",
//             },
//           }}
//         >
//           {savedStates.map((state) => (
//             <Box key={state.id} sx={{ textAlign: "center", flexShrink: 0 }}>
//               <Box
//                 sx={{
//                   width: "450px",
//                   height: "450px",
//                   position: "relative",
//                   cursor: "pointer",
//                   backgroundColor: "#f0f0f0",
//                   boxShadow: 3,
//                   borderRadius: "5px",
//                   overflow: "hidden",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}
//               >
//                 <Checkbox
//                   sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
//                   checked={checkedAvatars.includes(state.id)}
//                   onChange={() => handleCheckboxChange(state.id)}
//                 />
//                 <Box onClick={() => handleAvatarClick(state)}>
//                   <svg width="100%" height="100%" viewBox="0 0 500 400">
//                     <image href="/goku.svg" width="100%" height="100%" />
//                     {state.taggedLocations.map((location) => {
//                       const positions = highlightPositions[location];
//                       if (!positions) return null;

//                       return Array.isArray(positions) ? (
//                         positions.map((pos, index) => (
//                           <Tooltip key={`${location}-${index}`} title={state.botMessageContent} arrow>
//                             <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(255,0,0,0.3)" />
//                           </Tooltip>
//                         ))
//                       ) : (
//                         <Tooltip key={location} title={state.botMessageContent} arrow>
//                           <circle cx={positions.x} cy={positions.y} r="20" fill="rgba(255,0,0,0.3)" />
//                         </Tooltip>
//                       );
//                     })}
//                   </svg>
//                 </Box>
//               </Box>
//               <Box
//                 sx={{
//                   bgcolor: "black",
//                   color: "white",
//                   width: "120px",
//                   borderRadius: "5px",
//                   textAlign: "center",
//                   display: "inline-block",
//                   marginTop: "3px",
//                 }}
//               >
//                 {format(new Date(state.timestamp), "yyyy-MM-dd")}
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       )}

//       {/* Compare Two Avatars Button */}
//       <Tooltip title="Please select only 2 avatars" arrow>
//         <Button
//           sx={{ position: "fixed", bottom: 14, right: 14, boxShadow: 3 }}
//           variant="contained"
//           disabled={checkedAvatars.length !== 2}
//           onClick={handleCompareClick}
//         >
//           Compare Two Avatars
//         </Button>
//       </Tooltip>

//       {/* Modal for Comparing Avatars */}
//       <Modal
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         aria-labelledby="compare-avatars-modal"
//         aria-describedby="compare-selected-avatars"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "90%",
//             maxWidth: "1000px",
//             maxHeight: "90vh",
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             borderRadius: "8px",
//             p: 4,
//             outline: "none"
//           }}
//         >
//           <IconButton
//             sx={{ position: "absolute", top: 8, right: 8 }}
//             onClick={handleCloseModal}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Box sx={{ display: "flex", gap: "16px", justifyContent: "center" }}>
//             {savedStates
//               .filter((doc) => checkedAvatars.includes(doc.id))
//               .map((doc) => (
//                 <Box key={doc.id} sx={{ textAlign: "center", flexShrink: 0 }}>
//                   <Box
//                     sx={{
//                       width: "450px",
//                       height: "450px",
//                       position: "relative",
//                       cursor: "pointer",
//                       backgroundColor: "#f0f0f0",
//                       boxShadow: 3,
//                       borderRadius: "5px",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <svg width="100%" height="100%" viewBox="0 0 500 400">
//                       <image href="/goku.svg" width="100%" height="100%" />
//                       {doc.taggedLocations.map((location) => {
//                         const positions = highlightPositions[location];
//                         if (!positions) return null;

//                         return Array.isArray(positions) ? (
//                           positions.map((pos, index) => (
//                             <Tooltip key={`${location}-${index}`} title={doc.botMessageContent} arrow>
//                               <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(255,0,0,0.3)" />
//                             </Tooltip>
//                           ))
//                         ) : (
//                           <Tooltip key={location} title={doc.botMessageContent} arrow>
//                             <circle cx={positions.x} cy={positions.y} r="20" fill="rgba(255,0,0,0.3)" />
//                           </Tooltip>
//                         );
//                       })}
//                     </svg>
//                   </Box>
//                   <Box
//                     sx={{
//                       bgcolor: "black",
//                       color: "white",
//                       width: "120px",
//                       borderRadius: "5px",
//                       textAlign: "center",
//                       display: "inline-block",
//                       marginTop: "3px",
//                     }}
//                   >
//                     {format(new Date(doc.timestamp), "yyyy-MM-dd")}
//                   </Box>
//                 </Box>
//               ))}
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Box, CircularProgress, Typography, Tooltip, Button, Checkbox, Modal, IconButton, Chip, Paper} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";

const highlightPositions = {
  chest: { x: 250, y: 120 },
  hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
  face: { x: 250, y: 50 },
  crotch: { x: 250, y: 230 },
  butt: { x: 250, y: 250 },
  leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
  foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }],
  liver: {x: 220, y: 150},
  spleen : {x:270, y: 145},
  bowel : {x: 230, y: 175},
  bladder: {x: 250, y: 175},
  kidney: {x: 260, y: 170},
  pancreas: {x: 250, y: 150}
};

export default function CompareAvatar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savedStates, setSavedStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAvatars, setCheckedAvatars] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transforms, setTransforms] = useState<Record<string, { scale: number; translateX: number; translateY: number }>>({});

  useEffect(() => {
    if (!id) return;

    const fetchSavedStates = async () => {
      try {
        const db = getFirestore();
        const savedStatesCollection = collection(db, "savedStates");
        const q = query(savedStatesCollection, where("patientId", "==", id));
        const querySnapshot = await getDocs(q);

        const states = [];
        querySnapshot.forEach((doc) => {
          states.push({ id: doc.id, ...doc.data() });
        });

        setSavedStates(states);

        // Initialize transforms for each saved state
        const initialTransforms = states.reduce((acc, state) => {
          acc[state.id] = { scale: 1, translateX: 0, translateY: 0 };
          return acc;
        }, {});
        setTransforms(initialTransforms);
      } catch (error) {
        console.error("Error fetching saved states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStates();
  }, [id]);

  // Calculate start and end dates
  const calculateDateRange = () => {
    if (savedStates.length === 0) return { startDate: null, endDate: null };

    const sortedStates = savedStates.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const startDate = sortedStates[0].timestamp;
    const endDate = sortedStates[sortedStates.length - 1].timestamp;

    return { startDate, endDate };
  };

  const { startDate, endDate } = calculateDateRange();

  const handleAvatarClick = (savedState) => {
    navigate(`/avatar/${id}`, { state: { savedState } });
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedAvatars((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleZoom = (id: string, factor: number) => {
    setTransforms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        scale: Math.max(0.5, Math.min(prev[id].scale * factor, 3)),
      },
    }));
  };

  const handlePan = (id: string, dx: number, dy: number) => {
    setTransforms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        translateX: prev[id].translateX + dx / prev[id].scale,
        translateY: prev[id].translateY + dy / prev[id].scale,
      },
    }));
  };

  const handleReset = (id: string) => {
    setTransforms((prev) => ({
      ...prev,
      [id]: { scale: 1, translateX: 0, translateY: 0 },
    }));
  };

  return (
    <Box sx={{ paddingTop: "20px", paddingLeft: "20px" }}>
      {/* Top Box with Start and End Dates */}
      {startDate && endDate && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", 
            mb: 2,
          }}
        >
          {/* Start Date Box */}
          <Box
            sx={{
              bgcolor: "#f6f6f6",
              borderRadius: "5px",
              boxShadow: 3,
              padding: 2,
              maxWidth: "400px",
              backgroundColor: "primary.main"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", color: "white" }}>
              The start of the patient timeline
            </Typography>
            <Paper sx={{ ml: '33%', borderRadius: 400, display: "inline-block", backgroundColor: "#F8F8F8", color:"#696969", padding: "4px 8px", fontWeight: "bold", boxShadow: 0, border: "1px solid #696969" }}>
              {format(new Date(startDate), "yyyy-MM-dd")}
            </Paper>
          </Box>

          {/* Images with Links */}
          <Box
            sx={{
              display: "flex",
              gap: 4, 
            }}
          >
            <a href="https://www.asu.edu/" target="_blank" rel="noopener noreferrer">
              <img
                src="/asu-1.jpg"
                alt="Image 1"
                style={{ width: "140px", height: "100px", borderRadius: "8px" }}
              />
            </a>
            <a href="https://www.mayoclinic.org/" target="_blank" rel="noopener noreferrer">
              <img
                src="/mayo-logo.png" 
                alt="Image 2"
                style={{ width: "160px", height: "100px", borderRadius: "8px" }} 
              />
            </a>
          </Box>

          {/* End Date Box */}
          <Box
            sx={{
              bgcolor: "#f6f6f6",
              borderRadius: "5px",
              boxShadow: 3,
              padding: 2,
              maxWidth: "400px",
              mr: 2,
              backgroundColor: "primary.main"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", color: "white" }}>
              The end of the patient timeline
            </Typography>
            <Paper sx={{ ml: '33%', borderRadius: 400, display: "inline-block", backgroundColor: "#F8F8F8", color:"#696969", padding: "4px 8px", fontWeight: "bold", boxShadow: 0, border: "1px solid #696969" }}>
              {format(new Date(endDate), "yyyy-MM-dd")}
            </Paper>
          </Box>
        </Box>
      )}
      {loading ? (
        <CircularProgress />
      ) : savedStates.length === 0 ? (
        <Typography>No saved states found for this patient.</Typography>
      ) : (
        <Box sx={{ display: "flex", gap: "16px", overflowX: "auto", justifyContent: "flex-start", mt: "125px", paddingLeft: "12px", marginTop: "100px" }}>
          {savedStates.map((state) => {
            const transform = transforms[state.id] || { scale: 1, translateX: 0, translateY: 0 };

            return (
              <Box key={state.id} sx={{ textAlign: "center", flexShrink: 0 }}>
                <Box sx={{ width: "500px", height: "500px", position: "relative", cursor: "pointer", backgroundColor: "primary.main", boxShadow: 3, borderRadius: "5px", overflow: "hidden" }}>
                  <Checkbox
                    sx={{ position: "absolute", top: 0, right: 0, zIndex: 1, color: "white", '&.Mui-checked': {color: "white"} }}
                    checked={checkedAvatars.includes(state.id)}
                    onChange={() => handleCheckboxChange(state.id)}
                  />
     
                  {/* <Box sx={{ maxWidth: "150px", maxHeight: "150px", position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "5px", boxShadow: 2, zIndex: 1 }}>
                    <IconButton size="small" onClick={() => handleZoom(state.id, 1.2)}><AddIcon /></IconButton>
                    <IconButton size="small" onClick={() => handleZoom(state.id, 1 / 1.2)}><RemoveIcon /></IconButton>
                    <IconButton size="small" onClick={() => handleReset(state.id)}><RefreshIcon /></IconButton>
                  </Box>

                
                  <Box sx={{ maxWidth: "150px", maxHeight: "150px", position: "absolute", bottom: 10, left: "85%", transform: "translateX(-50%)", display: "grid", gap: 1, gridTemplateColumns: "repeat(3, 30px)", backgroundColor: "#fff", borderRadius: "8px", padding: "5px", boxShadow: 2, zIndex: 1 }}>
                    <span></span>
                    <IconButton size="small" onClick={() => handlePan(state.id, 0, -20)}><ArrowUpwardIcon /></IconButton>
                    <span></span>
                    <IconButton size="small" onClick={() => handlePan(state.id, -20, 0)}><ArrowBackIcon /></IconButton>
                    <span></span>
                    <IconButton size="small" onClick={() => handlePan(state.id, 20, 0)}><ArrowForwardIcon /></IconButton>
                    <span></span>
                    <IconButton size="small" onClick={() => handlePan(state.id, 0, 20)}><ArrowDownwardIcon /></IconButton>
                    <span></span>
                  </Box> */}

<Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0.5, 
          alignItems: "center", 
          justifyContent: "flex-end", 
          maxWidth: "300px", 
          maxHeight: "40px", 
          position: "absolute",
          bottom: 10,
          left: 10, 
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "4px", 
          boxShadow: 2,
        }}
      >

        <IconButton size="small" onClick={handleReset}>
          <RefreshIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handleZoom(1.2)}>
          <AddIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handleZoom(1 / 1.2)}>
          <RemoveIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handlePan(0, -20)}>
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handlePan(0, 20)}>
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" onClick={() => handlePan(-20, 0)}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handlePan(20, 0)}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>

   
                  <Box onClick={() => handleAvatarClick(state)}>
                    <svg width="100%" height="100%" viewBox="0 -15 500 400">
                      <g transform={`translate(${250 + transform.translateX * transform.scale}, ${200 + transform.translateY * transform.scale}) scale(${transform.scale}) translate(-250, -200)`}>
                        <image href="/Silhouette_of_a_woman.svg" width="100%" height="100%" />
                        {state.taggedLocations.map((location) => {
                          const positions = highlightPositions[location];
                          if (!positions) return null;

                          return Array.isArray(positions) ? (
                            positions.map((pos, index) => (
                              <Tooltip key={`${location}-${index}`} title={state.botMessageContent} arrow>
                                <circle cx={pos.x} cy={pos.y} r="10" fill="rgba(255,0,0,0.3)" />
                              </Tooltip>
                            ))
                          ) : (
                            <Tooltip key={location} title={state.botMessageContent} arrow>
                              <circle cx={positions.x} cy={positions.y} r="10" fill="rgba(255,0,0,0.3)" />
                            </Tooltip>
                          );
                        })}
                      </g>
                    </svg>
                  </Box>
                </Box>
                {/* <Box sx={{ bgcolor: "black", color: "white", width: "120px", borderRadius: "5px", textAlign: "center", display: "inline-block", marginTop: "15px" }}>
                  {format(new Date(state.timestamp), "yyyy-MM-dd")}
                </Box> */}
                <Paper sx={{ mt: 2, display: "inline-block", backgroundColor: "#F8F8F8", color:"#696969", padding: "4px 8px", fontWeight: "bold", boxShadow: 0, border: "1px solid #696969", borderRadius: 400}}> {format(new Date(state.timestamp), "yyyy-MM-dd")} </Paper>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Compare Two Avatars Button */}
      <Tooltip title="Please select only 2 avatars" arrow>
        <Button
          sx={{ position: "fixed", bottom: 14, right: 14, boxShadow: 3 }}
          variant="contained"
          disabled={checkedAvatars.length !== 2}
          onClick={handleCompareClick}
        >
          Compare Two Avatars
        </Button>
      </Tooltip>

      {/* Modal for Comparing Avatars */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: "1000px", maxHeight: "90vh", bgcolor: "background.paper", boxShadow: 24, borderRadius: "8px", p: 4, outline: "none" }}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {savedStates
              .filter((doc) => checkedAvatars.includes(doc.id))
              .map((doc) => {
                const transform = transforms[doc.id] || { scale: 1, translateX: 0, translateY: 0 };

                return (
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: doc.id * 0.2 }}
                  key={doc.id}
                  >
                                      <Box key={doc.id} sx={{ textAlign: "center", flexShrink: 0 }}>
                    <Box sx={{ width: "450px", height: "450px", position: "relative", cursor: "pointer", backgroundColor: "primary.main", boxShadow: 3, borderRadius: "5px", overflow: "hidden" }}>

                      {/* Pan Controls */}
                      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0.5, 
          alignItems: "center", 
          justifyContent: "flex-end", 
          maxWidth: "300px", 
          maxHeight: "40px", 
          position: "absolute",
          bottom: 10,
          left: 10, 
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "4px", 
          boxShadow: 2,
        }}
      >

        <IconButton size="small" onClick={handleReset}>
          <RefreshIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handleZoom(1.2)}>
          <AddIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handleZoom(1 / 1.2)}>
          <RemoveIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handlePan(0, -20)}>
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handlePan(0, 20)}>
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" onClick={() => handlePan(-20, 0)}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>


        <IconButton size="small" onClick={() => handlePan(20, 0)}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>

                      {/* SVG */}
                      <svg width="100%" height="100%" viewBox="0 0 500 400">
                        <g transform={`translate(${250 + transform.translateX * transform.scale}, ${200 + transform.translateY * transform.scale}) scale(${transform.scale}) translate(-250, -200)`}>
                          <image href="/Silhouette_of_a_woman.svg" width="100%" height="100%" />
                          {doc.taggedLocations.map((location) => {
                            const positions = highlightPositions[location];
                            if (!positions) return null;

                            return Array.isArray(positions) ? (
                              positions.map((pos, index) => (
                                <Tooltip key={`${location}-${index}`} title={doc.botMessageContent} arrow>
                                  <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(255,0,0,0.3)" />
                                </Tooltip>
                              ))
                            ) : (
                              <Tooltip key={location} title={doc.botMessageContent} arrow>
                                <circle cx={positions.x} cy={positions.y} r="20" fill="rgba(255,0,0,0.3)" />
                              </Tooltip>
                            );
                          })}
                        </g>
                      </svg>
                    </Box>
                    <br/>
                    <Paper sx={{ color: "white", display: "inline-block", backgroundColor: "#F8F8F8", color:"#696969", padding: "4px 8px", borderRadius: 400, fontWeight: "bold", boxShadow: 0, border: "1px solid #696969"}}> {format(new Date(doc.timestamp), "yyyy-MM-dd")} </Paper>
                  </Box>
                  </motion.div>
                );
              })}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}