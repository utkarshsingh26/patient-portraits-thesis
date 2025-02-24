import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Box, CircularProgress, Typography, Tooltip, Chip, Button, Checkbox, IconButton, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { format } from 'date-fns'

const highlightPositions = {
  chest: { x: 250, y: 120 },
  hands: [{ x: 150, y: 200 }, { x: 350, y: 200 }],
  face: { x: 250, y: 50 },
  crotch: { x: 250, y: 230 },
  butt: { x: 250, y: 250 },
  leg: [{ x: 200, y: 300 }, { x: 300, y: 300 }],
  foot: [{ x: 200, y: 380 }, { x: 300, y: 380 }]
};

export default function CompareAvatar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savedStates, setSavedStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAvatars, setCheckedAvatars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      } catch (error) {
        console.error("Error fetching saved states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStates();
  }, [id]);

  const handleAvatarClick = (savedState) => {
    navigate(`/avatar/${id}`, { state: { savedState } });
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {loading ? (
        <CircularProgress />
      ) : savedStates.length === 0 ? (
        <Typography>No saved states found for this patient.</Typography>
      ) : (
        <Box sx={{ display: "flex", gap: "16px", overflowX: "auto", justifyContent: "center", mt: "125px" }}>
          {savedStates.map((state) => (
            <Box key={state.id} sx={{ textAlign: "center" }}>
              <Box
                sx={{ width: "450px", height: "450px", position: "relative", cursor: "pointer", backgroundColor: "#f0f0f0", boxShadow: 3, borderRadius: "5px", overflow: "hidden" }}
                onClick={() => handleAvatarClick(state)}
              >
                <svg width="100%" height="100%" viewBox="0 0 500 400">
                  <image href="/goku.svg" width="100%" height="100%" />
                  {state.taggedLocations.map((location) => {
                    const positions = highlightPositions[location];
                    if (!positions) return null;

                    return Array.isArray(positions) ? (
                      positions.map((pos, index) => (
                        <Tooltip key={`${location}-${index}`} title={state.botMessageContent} arrow>
                          <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(255,0,0,0.3)" />
                        </Tooltip>
                      ))
                    ) : (
                      <Tooltip key={location} title={state.botMessageContent} arrow>
                        <circle cx={positions.x} cy={positions.y} r="20" fill="rgba(255,0,0,0.3)" />
                      </Tooltip>
                    );
                  })}
                </svg>
              </Box>
              <Box sx={{ bgcolor: "black", color: "white", width: "120px", borderRadius: "5px", textAlign: "center", display: "inline-block", marginTop: "3px" }}>
                {format(new Date(state.timestamp), "yyyy-MM-dd")}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}