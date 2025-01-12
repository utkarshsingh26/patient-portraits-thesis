import { Button, Box } from '@mui/material';

function Landing() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Button 
        variant="contained" 
        size="large" 
        onClick={() => alert('Under Construction!')}
      >
        Transform your care
      </Button>
    </Box>
  );
}

export default Landing;
