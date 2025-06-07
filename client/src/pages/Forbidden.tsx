import { Container, Paper, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <Container
      fixed
      sx={{ display: 'flex', justifyContent: 'center', mt: '50px' }}
    >
      <Paper
        sx={{
          p: '30px',
          border: '1px solid',
          borderTopColor: 'secondary.dark',
          borderLeftColor: 'secondary.dark',
          borderRightColor: 'primary.dark',
          borderBottomColor: 'primary.dark',
        }}
      >
        <Stack gap="30px" justifyContent={'center'} alignItems={'center'}>
          <Typography variant="h4" fontWeight={800}>
            Forbidden
          </Typography>
          <Typography color="text.secondary" fontWeight={500}>
            You do not have permission to access this page
          </Typography>
          <Button
            size="small"
            sx={{ py: '15px', width: '150px', borderRadius: '30px' }}
            variant="contained"
            onClick={() => navigate('/')}
          >
            Back
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Forbidden;
