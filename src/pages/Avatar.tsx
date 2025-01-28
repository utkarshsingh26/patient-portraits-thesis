import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DrawerAppBar from '../components/DrawerAppBar';
import RowAndColumnSpacing from '../components/RowAndColumnSpacing';
import RecipeReviewCard from '../components/RecipeReviewCard';
// import UnstyledTextareaIntroduction from '../components/UnstyledTextareaIntroduction';

function Avatar() {
    return (
        <Container>
            <DrawerAppBar />
            <Box my={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <RowAndColumnSpacing />
                    </Grid>
                    {/* <Grid item xs={12} md={4}>
                        <UnstyledTextareaIntroduction />
                    </Grid> */}
                    <Grid item xs={12} md={4}>
                        <RecipeReviewCard />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Avatar;
