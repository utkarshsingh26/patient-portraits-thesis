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

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //const openAiApiKey = "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";
  const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY
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
          messages: [{ role: "user", content: input }],
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
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
        mt: 4,
        p: 2,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Talk to Wellbee
      </Typography>
      <Box
        sx={{
          height: "400px",
          overflowY: "auto",
          mb: 2,
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        {messages.map((msg, idx) => (
          <Card
            key={idx}
            sx={{
              mb: 1,
              backgroundColor: msg.sender === "user" ? "#e3f2fd" : "#f1f8e9",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <CardContent>
              <Typography
                variant="body1"
                sx={{ fontWeight: msg.sender === "user" ? "bold" : "normal" }}
              >
                {msg.sender === "user" ? "You" : "Wellbee"}
              </Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </CardContent>
          </Card>
        ))}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
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
