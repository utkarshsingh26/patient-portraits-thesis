import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DrawerAppBar from '../components/DrawerAppBar';
import RowAndColumnSpacing from '../components/RowAndColumnSpacing';
import ChatbotComponent from '../components/ChatbotComponent';
import RecipeReviewCard from '../components/RecipeReviewCard';

function Avatar() {
    const [docxTexts, setDocxTexts] = useState<string[]>([]);

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
                        <RecipeReviewCard />
                    </Grid>

                </Grid>
            </Box>
        </Container>
    );
}

export default Avatar;
