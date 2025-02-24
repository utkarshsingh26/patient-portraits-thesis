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
  onChatHistoryChange: (chatHistory: ChatItem[]) => void;
  chatHistory: ChatItem[];
}

const Chatbot: React.FC<ChatbotProps> = ({
  extractedText,
  onTaggedLocationsChange,
  onBotMessageContentChange,
  onReportsReferencedChange,
  onChatHistoryChange,
  chatHistory = [], // Default to empty array
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  console.log("ChatbotComponent - chatHistory:", chatHistory); // Debugging

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
      onReportsReferencedChange(filteredReports);

      const newChatItem: ChatItem = {
        userQuestion: input,
        botResponse: botMessageContent,
        taggedLocations: taggedLocations.join(", "),
        reportsReferenced: filteredReports,
        botMessageContent: botMessageContent,
      };

      const updatedChatHistory = [...chatHistory, newChatItem];
      onChatHistoryChange(updatedChatHistory);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const newChatItem: ChatItem = {
        userQuestion: input,
        botResponse: "Sorry, I couldn't process that. Please try again.",
        taggedLocations: "",
        reportsReferenced: [],
        botMessageContent: "",
      };
      const updatedChatHistory = [...chatHistory, newChatItem];
      onChatHistoryChange(updatedChatHistory);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: "600px", margin: "auto", mt: 4, p: 2, bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3 }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold", color: "text.secondary" }}> Past Summaries </Typography>
        <Box sx={{ height: "200px", overflowY: "auto", mb: 2 }}>
          {chatHistory?.map((chat, index) => ( // Use optional chaining
            <Accordion key={index} sx={{ mb: 5, backgroundColor: "black", color: "white", borderRadius: 5 }}>
              <AccordionSummary>
                <Typography variant="body2"><b>{chat.botResponse}</b></Typography>
              </AccordionSummary>
              <AccordionDetails>
                {chat.taggedLocations && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "white" }}>
                      Tagged Locations:
                    </Typography>
                    <Typography variant="body2">{chat.taggedLocations}</Typography>
                  </Box>
                )}
                {chat.reportsReferenced.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "white" }}>
                      Report(s) Referenced:
                    </Typography>
                    <Typography variant="body2">
                      {chat.reportsReferenced.join(", ")}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, color: "white" }}>
                  Prompt:
                </Typography>
                <Typography variant="body2">{chat.userQuestion}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
          {loading && <CircularProgress size={24} />}
        </Box>
      </Box>

      <Box sx={{ width: "100%", maxWidth: "600px", margin: "auto", mt: 4, p: 2, bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3 }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold", color: "text.secondary" }}> Get our AI to make inferences </Typography>
        <br />
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask away..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ color: "white" }}
          />
          <IconButton color="primary" onClick={sendMessage} disabled={loading} sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: "8px" }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ width: "100%", maxWidth: "600px", margin: "auto", mt: 4, p: 2, bgcolor: "#f6f6f6", borderRadius: "5px", boxShadow: 3 }}>
        <Accordion sx={{ bgcolor: "white", color: "text.secondary", borderRadius: "5px", paddingBottom: "5px" }}>
          <AccordionSummary><Typography sx={{ textAlign: "center", fontWeight: "bold", justifyContent: "center", width: '100%' }}>Saved prompts</Typography></AccordionSummary>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 5, justifyContent: "center", color: "white" }}>
            {["What's wrong with the patient?", "Give me the date of the report 1.", "Tell me about the patient's liver."].map((prompt, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => setInput(prompt)}
                sx={{ textTransform: "none", backgroundColor: "black", color: "white", borderRadius: 3 }}
              >
                <b>{prompt}</b>
              </Button>
            ))}
          </Box>
        </Accordion>
      </Box>
    </>
  );
};

export default Chatbot;