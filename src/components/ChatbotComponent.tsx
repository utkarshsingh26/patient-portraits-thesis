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
            { role: "user", content: input }
          ],
        }),
      });

      const data = await response.json();
      const botMessage: ChatMessage = {
        sender: "bot",
        message: data.choices[0].message.content,
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
        <TextField fullWidth placeholder="Type your message..." variant="outlined" value={input} onChange={(e) => setInput(e.target.value)} />
        <IconButton color="primary" onClick={sendMessage} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chatbot;
