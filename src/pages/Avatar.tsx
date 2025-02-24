import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import DrawerAppBar from "../components/DrawerAppBar";
import IndividiualPatientReports from "../components/IndividiualPatientReports";
import ChatbotComponent from "../components/ChatbotComponent";
import ReportsReferenced from "../components/ReferencedReports";
import HumanBody from "../components/HumanBody2D";
import IndividualPatientInfo from "../components/IndiviualPatientInfo";
import Button from "@mui/material/Button";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Document, Packer, Paragraph } from "docx";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

function Avatar() {
  const patientId = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [docxTexts, setDocxTexts] = useState<string[]>([]);
  const [taggedLocations, setTaggedLocations] = useState<string[]>([]);
  const [botMessageContent, setBotMessageContent] = useState<string>("");
  const [reportsReferenced, setReportsReferenced] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [savedStateId, setSavedStateId] = useState<string | null>(null); // Track the saved state ID

  // Check for saved state in location state (passed from Timeline.tsx)
  useEffect(() => {
    if (location.state?.savedState) {
      const { taggedLocations, botMessageContent, reportsReferenced, docxTexts, chatHistory, id } = location.state.savedState;
      setTaggedLocations(taggedLocations);
      setBotMessageContent(botMessageContent);
      setReportsReferenced(reportsReferenced);
      setDocxTexts(docxTexts);
      setChatHistory(chatHistory || []);
      setSavedStateId(id); // Set the saved state ID
    }
  }, [location.state]);

  const handleSaveToTimeline = async () => {
    if (!patientId) {
      alert("Patient ID not found!");
      return;
    }

    const todayDate = format(new Date(), "yyyy-MM-dd");
    const state = {
      patientId: patientId.id,
      timestamp: new Date().toISOString(),
      taggedLocations,
      botMessageContent,
      reportsReferenced,
      docxTexts,
      chatHistory,
    };

    try {
      const db = getFirestore();
      const savedStatesCollection = collection(db, "savedStates");

      if (savedStateId) {
        // Update existing state
        const stateRef = doc(savedStatesCollection, savedStateId);
        await setDoc(stateRef, state);
        console.log("State updated successfully!");
      } else {
        // Create new state
        const docRef = await addDoc(savedStatesCollection, state);
        setSavedStateId(docRef.id); // Save the new document ID
        console.log("State saved successfully!");
      }

      alert("State saved successfully!");
    } catch (error) {
      console.error("Error saving state:", error);
      alert("Failed to save state. Please try again.");
    }
  };

  const handleTimelineClick = () => {
    if (!patientId?.id) {
      alert("Patient ID not found!");
      return;
    }
    navigate(`/timeline/${patientId.id}`);
  };

  return (
    <Container maxWidth="false" disableGutters sx={{ padding: 0, margin: 0, bgcolor: "#ffffff" }}>
      <DrawerAppBar />
      <Box sx={{ display: "flex", height: "calc(100vh - 90px)", mt: 2 }}>
        <PanelGroup direction="horizontal">
          {/* Existing panel layout */}
          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
                  <IndividiualPatientReports onExtractedText={setDocxTexts} />
                </Box>
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ p: 2 }}>
                  <ReportsReferenced reports={reportsReferenced} botMessageContent={botMessageContent} />
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={40} minSize={20}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", p: 2 }}>
              <ChatbotComponent
                extractedText={docxTexts.join("\n\n")}
                onTaggedLocationsChange={setTaggedLocations}
                onBotMessageContentChange={setBotMessageContent}
                onReportsReferencedChange={setReportsReferenced}
                onChatHistoryChange={setChatHistory}
                chatHistory={chatHistory}
              />
            </Box>
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ ml: 22, mb: 8, p: 2 }}>
                  <IndividualPatientInfo />
                </Box>
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={40} minSize={30}>
                <Box sx={{ p: 2 }}>
                  <HumanBody taggedLocations={taggedLocations} botMessageContent={botMessageContent} />
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Box>

      {/* Floating Save Button */}
      <Button variant="contained" color="success" sx={{ position: "fixed", bottom: 14, right: 84 }} onClick={handleSaveToTimeline}>
        <SaveOutlinedIcon />
      </Button>
      <Button variant="contained" color="primary" sx={{ position: "fixed", bottom: 14, right: 14 }} onClick={handleTimelineClick}>
        <TimelineOutlinedIcon />
      </Button>
    </Container>
  );
}

export default Avatar;