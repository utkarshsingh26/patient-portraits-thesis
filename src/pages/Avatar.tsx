import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function Avatar() {
  const patientId = useParams();
  const [docxTexts, setDocxTexts] = useState<string[]>([]);
  const [taggedLocations, setTaggedLocations] = useState<string[]>([]);
  const [botMessageContent, setBotMessageContent] = useState<string>("");
  const [reportsReferenced, setReportsReferenced] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSaveToTimeline = async () => {
    if (!patientId) {
      alert("Patient ID not found!");
      return;
    }

    const storage = getStorage();
    const todayDate = format(new Date(), "yyyy-MM-dd");
    let fileName = `${patientId['id']}_${todayDate}.docx`;
    const folderRef = ref(storage, "avatars/");

    try {
      // List existing files in 'avatars/' folder
      const existingFiles = await listAll(folderRef);
      const existingFileNames = existingFiles.items.map((item) => item.name);

      // Find duplicates and determine the next filename
      let counter = 1;
      while (existingFileNames.includes(fileName)) {
        fileName = `${patientId['id']}_${todayDate}_${counter}.docx`;
        counter++;
      }

      // Create docx content
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ text: "Tagged Locations", heading: "Heading1" }),
              ...taggedLocations.map((location) => new Paragraph(`• ${location}`)),
              new Paragraph({ text: "\nBot Message Content", heading: "Heading1" }),
              new Paragraph(botMessageContent),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const fileRef = ref(storage, `avatars/${fileName}`);
      await uploadBytes(fileRef, blob);
      const fileURL = await getDownloadURL(fileRef);

      console.log("File uploaded successfully:", fileURL);
      alert("Saved to Timeline Successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to save. Please try again.");
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

          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
                  <IndividiualPatientReports onExtractedText={setDocxTexts} />
                </Box>
              </Panel>
              <PanelResizeHandle>
                {/* <Box sx={{ height: "4px", backgroundColor: "gray", cursor: "row-resize" }} /> */}
              </PanelResizeHandle>
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ p: 2 }}>
                  <ReportsReferenced reports={reportsReferenced} botMessageContent={botMessageContent} />
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>


          <PanelResizeHandle>
                <Box sx={{ width: "4px", backgroundColor: "gray", cursor: "row-resize" }} />
              </PanelResizeHandle>


          <Panel defaultSize={40} minSize={20}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", p: 2 }}>
              <ChatbotComponent
                extractedText={docxTexts.join("\n\n")}
                onTaggedLocationsChange={setTaggedLocations}
                onBotMessageContentChange={setBotMessageContent}
                onReportsReferencedChange={setReportsReferenced}
              />
            </Box>
          </Panel>

          <PanelResizeHandle>
                <Box sx={{ width: "4px", color: "gray", cursor: "row-resize"}} />
              </PanelResizeHandle>

          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={30}>
                <Box sx={{ ml: 22, mb: 8, p: 2 }}>
                  <IndividualPatientInfo />
                </Box>
              </Panel>
              <PanelResizeHandle>
                {/* <Box sx={{ height: "4px", backgroundColor: "gray", cursor: "row-resize", width: "12500px" }} /> */}
              </PanelResizeHandle>
              <Panel defaultSize={40} minSize={30}>
                <Box sx={{ p: 2}}>
                  <HumanBody taggedLocations={taggedLocations} botMessageContent={botMessageContent} />
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>

        </PanelGroup>
      </Box>

      {/* Floating Save Button */}
      <Button variant="contained" color="success" sx={{ position: "fixed", bottom: 14, right: 84 }} onClick={handleSaveToTimeline}>
        <SaveOutlinedIcon/>
      </Button>
      <Button variant="contained" color="primary" sx={{ position: "fixed", bottom: 14, right: 14 }} onClick={handleTimelineClick}>
        <TimelineOutlinedIcon/>
      </Button>
    </Container>
  );
}

export default Avatar;

