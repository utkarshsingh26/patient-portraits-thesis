import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DrawerAppBar from '../components/DrawerAppBar';
import RowAndColumnSpacing from '../components/RowAndColumnSpacing';
import ChatbotComponent from '../components/ChatbotComponent';

function Avatar() {
    const [docxTexts, setDocxTexts] = useState<string[]>([]);

    return (
        <Container>
            <DrawerAppBar />
            <Box my={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <RowAndColumnSpacing onExtractedText={setDocxTexts} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <ChatbotComponent extractedText={docxTexts.join("\n\n")} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Avatar;
