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

const Chatbot: React.FC<{ extractedText: string }> = ({ extractedText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");  
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>(""); // State to hold the user's question

  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { sender: "user", message: input };
    setMessages((prev) => [...prev, newMessage]);
    setUserQuestion(input); // Store the user's question here
    setInput("");
    setLoading(true);

    const bodyPartsKeywords = {
      "chest": ["chest", "thoracic", "sternum", "lymph nodes", "lymph node"],
      "hands": ["hand", "wrist", "carpal"],
      "face": ["face", "facial", "jaw", "cranial"],
      "crotch": ["crotch", "inguinal", "groin", "prostate"],
      "butt": ["butt", "gluteal", "sacral"],
      "leg": ["leg", "thigh", "knee", "femoral"],
      "foot": ["foot", "ankle", "calcaneal", "plantar"]
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

      const detectedParts = detectBodyParts(botMessageContent);

      const bodyPartsMessage = detectedParts.size > 0
        ? `The following body parts were detected: ${Array.from(detectedParts).join(", ")}.`
        : "No specific body parts identified.";

      setResponse(`${botMessageContent}\n\n${bodyPartsMessage}`);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Sorry, I couldn't process that. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "600px", margin: "auto", mt: 4, p: 2, border: "1px solid gray", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Talk to Wellbee
      </Typography>
      <Box sx={{ height: "400px", overflowY: "auto", mb: 2 }}>
        {response && (
          <Accordion>
            <AccordionSummary>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "orange" }}>
                Response:
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{response}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, color: "green" }}>
                Prompt:
              </Typography>
              <Typography variant="body2">{userQuestion}</Typography> {/* Display the user's input here */}
            </AccordionDetails>
          </Accordion>
        )}
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
        {["What's wrong with the patient?", "Give me the date of the latest report.", "Tell me about the patient's liver."].map((prompt, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => setInput(prompt)}
            sx={{ textTransform: "none" }} // Keeps text normal case
          >
            {prompt}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Chatbot;
