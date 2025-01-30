import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
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

  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { sender: "user", message: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    // Expanded keywords for body parts
    const bodyPartsKeywords = {
      "chest": ["chest", "thoracic", "sternum", "lymph nodes", "lymph node"],
      "hands": ["hand", "wrist", "carpal"],
      "face": ["face", "facial", "jaw", "cranial"],
      "crotch": ["crotch", "inguinal", "groin", "prostate"],
      "butt": ["butt", "gluteal", "sacral"],
      "leg": ["leg", "thigh", "knee", "femoral"],
      "foot": ["foot", "ankle", "calcaneal", "plantar"]
    };

    // Function to detect body parts in the text
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

      // Detect body parts in the bot's response
      const detectedParts = detectBodyParts(botMessageContent);

      // Formulate the response message
      const bodyPartsMessage = detectedParts.size > 0
        ? `The following body parts were detected: ${Array.from(detectedParts).join(", ")}.`
        : "No specific body parts identified.";

      const botMessage: ChatMessage = {
        sender: "bot",
        message: `${botMessageContent}\n\n${bodyPartsMessage}`,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "600px", margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Talk to Wellbee
      </Typography>
      <Box sx={{ height: "400px", overflowY: "auto", mb: 2 }}>
        {messages.map((msg, idx) => (
          <Card key={idx} sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="body1">{msg.sender === "user" ? "You" : "Wellbee"}</Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </CardContent>
          </Card>
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
        <IconButton color="primary" onClick={sendMessage} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chatbot;
