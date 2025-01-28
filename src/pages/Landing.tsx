import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/home');
  };

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
        onClick={handleButtonClick}
      >
        Transform your care
      </Button>
    </Box>
  );
}

export default Landing;
