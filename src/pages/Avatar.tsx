import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DrawerAppBar from '../components/DrawerAppBar';
import RowAndColumnSpacing from '../components/RowAndColumnSpacing';
import ChatbotComponent from '../components/ChatbotComponent';
import RecipeReviewCard from '../components/RecipeReviewCard';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HumanBody from '../components/HumanBody2D';

function Avatar() {
    const [docxTexts, setDocxTexts] = useState<string[]>([]);
    const [openTextBox, setOpenTextBox] = useState(false);
    const [text, setText] = useState("Predefined text goes here...");

    return (
        <Container maxWidth="lg" disableGutters>
            <DrawerAppBar />
            <Box 
                sx={{ 
                    display: 'flex', 
                    height: 'calc(100vh - 90px)', // Full height minus app bar
                    mt: 2, 
                    px: 3 
                }}
            >
                <Grid container sx={{ flexGrow: 1 }}>
                    
                    {/* Left Panel */}
                    <Grid 
                        item 
                        xs={12} 
                        md={4} 
                        sx={{ pr: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <RowAndColumnSpacing onExtractedText={setDocxTexts} />
                    </Grid>

                    {/* First Vertical Divider */}
                    <Grid 
                        item 
                        md={0.5} 
                        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}
                    >
                        <Box sx={{ width: '2px', backgroundColor: 'gray', height: '100%' }} />
                    </Grid>

                    {/* Middle Panel (Chatbot) */}
                    <Grid 
                        item 
                        xs={12} 
                        md={3.5} 
                        sx={{ px: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                        <ChatbotComponent extractedText={docxTexts.join("\n\n")} />
                    </Grid>

                    {/* Second Vertical Divider */}
                    <Grid 
                        item 
                        md={0.5} 
                        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}
                    >
                        <Box sx={{ width: '2px', backgroundColor: 'gray', height: '100%' }} />
                    </Grid>

                    {/* Right Panel (Recipe Review Card) */}
                    <Grid 
                        item 
                        xs={12} 
                        md={3.5} 
                        sx={{ pl: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                        {/* <RecipeReviewCard /> */}
                        <HumanBody />
                    </Grid>

                </Grid>
            </Box>
            <Fab color="secondary" aria-label="edit" sx={{ position: 'fixed', bottom: 14, right: 14 }} onClick={() => setOpenTextBox(true)}>
                <EditIcon />
            </Fab>

            {openTextBox && (
                <Paper
                    elevation={3}
                    sx={{ 
                        position: 'fixed', 
                        bottom: 80, 
                        right: 16, 
                        p: 2, 
                        width: 300 
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            variant="outlined"
                        />
                        <IconButton onClick={() => setOpenTextBox(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </Container>
    );
}

export default Avatar;
