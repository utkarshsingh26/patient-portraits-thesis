import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

interface ChatItem {
  userQuestion: string;
  botResponse: string;
  taggedLocations: string;
  reportsReferenced: string[];
  botMessageContent: string; 
}

interface ChatbotProps {
  extractedText: string;
  onTaggedLocationsChange: (taggedLocations: string[]) => void;
  onBotMessageContentChange: (botMessageContent: string) => void; 
  onReportsReferencedChange: (reports: string[]) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ extractedText, onTaggedLocationsChange, onBotMessageContentChange, onReportsReferencedChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;


  const extractReportNames = (text: string): string[] => {
    const reportRegex = /(?:Report[:\s]+)([\w\s]+(?:[A-Za-z0-9-]*))/g;
    const matches = [...text.matchAll(reportRegex)];
    return matches.map((match, index) => `Report ${index + 1}`);
  };


  const filterReports = (userInput: string, allReports: string[]): string[] => {
    const reportMatch = userInput.match(/report\s*(\d+)/i);
    if (reportMatch) {
      const reportNumber = parseInt(reportMatch[1], 10);
      return allReports.slice(0, reportNumber);
    }
    return allReports;
  };

  const bodyPartsKeywords = {
    chest: ["chest", "thoracic", "sternum", "lymph nodes", "lymph node"],
    hands: ["hand", "wrist", "carpal"],
    face: ["face", "facial", "jaw", "cranial"],
    crotch: ["crotch", "inguinal", "groin", "prostate"],
    butt: ["butt", "gluteal", "sacral"],
    leg: ["leg", "thigh", "knee", "femoral"],
    foot: ["foot", "ankle", "calcaneal", "plantar"],
  };

  const detectBodyParts = (text: string) => {
    const partsFound = new Set<string>();
    for (const [part, keywords] of Object.entries(bodyPartsKeywords)) {
      if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
        partsFound.add(part);
      }
    }
    return partsFound;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { sender: "user", message: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: `Here is a document for reference:\n\n${extractedText}` },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      const botMessageContent = data.choices[0].message.content;


      onBotMessageContentChange(botMessageContent);


      const detectedParts = detectBodyParts(botMessageContent);
      const taggedLocations = Array.from(detectedParts);


      onTaggedLocationsChange(taggedLocations);


      const reportsReferenced = extractReportNames(extractedText);
      const filteredReports = filterReports(input, reportsReferenced);
      onReportsReferencedChange(filteredReports)


      setChatHistory((prev) => [
        ...prev,
        {
          userQuestion: input,
          botResponse: botMessageContent,
          taggedLocations: taggedLocations.join(", "),
          reportsReferenced: filteredReports,
          botMessageContent: botMessageContent,
        },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          userQuestion: input,
          botResponse: "Sorry, I couldn't process that. Please try again.",
          taggedLocations: "",
          reportsReferenced: [],
          botMessageContent: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "600px", margin: "auto", mt: 4, p: 2}}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        {/* Talk to Wellbee */}
      </Typography>
      <Box sx={{ height: "400px", overflowY: "auto", mb: 2 }}>
        {chatHistory.map((chat, index) => (
          <Accordion key={index} sx = {{mb: 5, background: "#D3D3D3"}}>
            <AccordionSummary>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "white" }}>
                Response
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{chat.botResponse}</Typography>

              {chat.taggedLocations && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "purple" }}>
                    Tagged Locations:
                  </Typography>
                  <Typography variant="body2">{chat.taggedLocations}</Typography>
                </Box>
              )}


              {chat.reportsReferenced.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "green" }}>
                    Report(s) Referenced:
                  </Typography>
                  <Typography variant="body2">
                    {chat.reportsReferenced.join(", ")}
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, color: "blue" }}>
                Prompt:
              </Typography>
              <Typography variant="body2">{chat.userQuestion}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        {loading && <CircularProgress size={24} />}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <IconButton color="primary" onClick={sendMessage} disabled={loading} sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: "8px" }}>
          <SendIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, justifyContent: "center" }}>
        {["What's wrong with the patient?", "Give me the date of the report 1.", "Tell me about the patient's liver."].map((prompt, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => setInput(prompt)}
            sx={{ textTransform: "none" }}
          >
            {prompt}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Chatbot;