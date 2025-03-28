import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
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
            404 Not Found
          </Typography>
          <Typography color="text.secondary" fontWeight={500}>
            Oops... It looks like the requested page does not exist
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
export default NotFound;
