import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import DrawerAppBar from "../components/DrawerAppBar";
import RowAndColumnSpacing from "../components/RowAndColumnSpacing";
import ChatbotComponent from "../components/ChatbotComponent";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import HumanBody from "../components/HumanBody2D";
import IndividualPatientInfo from "../components/IndiviualPatientInfo";
import ReportsReferenced from "../components/ReferencedReports";
import Button from '@mui/material/Button';

// Import react-resizable-panels components
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function Avatar() {
  const [docxTexts, setDocxTexts] = useState<string[]>([]);
  const [openTextBox, setOpenTextBox] = useState(false);
  const [text, setText] = useState("Predefined text goes here...");
  const [taggedLocations, setTaggedLocations] = useState<string[]>([]);
  const [botMessageContent, setBotMessageContent] = useState<string>("");
  const [reportsReferenced, setReportsReferenced] = useState<string[]>([]);  // New state to hold reports

  return (
    <Container maxWidth="lg" disableGutters>
      <DrawerAppBar />
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 90px)", // Full height minus app bar
          mt: 2,
        }}
      >
        {/* Resizable Panels */}
        <PanelGroup direction="horizontal">
          {/* Left Panel (RowAndColumnSpacing + ReportsReferenced) */}
          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={30}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <RowAndColumnSpacing onExtractedText={setDocxTexts} />
                </Box>
              </Panel>
              <PanelResizeHandle>
                <Box
                  sx={{
                    height: "4px",
                    backgroundColor: "gray",
                    cursor: "row-resize",
                  }}
                />
              </PanelResizeHandle>
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ p: 2 }}>
                  <ReportsReferenced reports={reportsReferenced} botMessageContent={botMessageContent} />
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>

          {/* Middle Panel (Chatbot) */}
          <Panel defaultSize={40} minSize={20}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 2,
              }}
            >
          <ChatbotComponent
            extractedText={docxTexts.join("\n\n")}
            onTaggedLocationsChange={setTaggedLocations}
            onBotMessageContentChange={setBotMessageContent}
            onReportsReferencedChange={setReportsReferenced} // Pass the function to update reports
          />
            </Box>
          </Panel>

          {/* Right Panel (Patient Info + Human Body) */}
          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ ml: 22, mb: 8, p: 2 }}>
                  <IndividualPatientInfo />
                </Box>
              </Panel>
              <PanelResizeHandle>
                <Box
                  sx={{
                    height: "4px",
                    backgroundColor: "gray",
                    cursor: "row-resize",
                    width: "12500px",
                  }}
                />
              </PanelResizeHandle>
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ p: 2 }}>
                  <HumanBody
                    taggedLocations={taggedLocations}
                    botMessageContent={botMessageContent}
                  />
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Box>

      {/* Floating Save Button */}
        <Button variant="contained" color="success" sx={{position: "fixed", bottom: 14, right: 14}}>
        Save to Timeline
      </Button>
    </Container>
  );
}

export default Avatar;
