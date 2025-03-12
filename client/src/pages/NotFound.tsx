import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container
      fixed
      sx={{ display: 'flex', justifyContent: 'center', mt: '50px' }}
    >
      <Paper>
        <Stack gap="30px" justifyContent={'center'} alignItems={'center'}>
          <Typography variant="h4" fontWeight={800}>
            404 Not Found
          </Typography>
          <Typography fontWeight={500}>
            Ups... Wygląda na to, że podana strona nie istnieje
          </Typography>
          <Button
            size="large"
            sx={{ py: '15px', width: '150px', borderRadius: '30px' }}
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Powrót
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
export default NotFound;
