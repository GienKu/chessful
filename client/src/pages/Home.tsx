import { Container, Box, Stack } from '@mui/material';
import crown from '../assets/crown.png';
import FriendsList from '../components/FriendsList/FriendsList';
import PastGames from '../components/PastGames/PastGames';

import CreateGame from '../components/CreateGame/CreateGame';
import GamesList from '../components/GamesList/GamesList';

const Home = () => {
  return (
    <Box sx={{ m: 0, height: '100%' }}>
      <Stack
        sx={{ background: 'linear-gradient(to bottom, black, #121212)' }}
        direction={{ xs: 'column-reverse', sm: 'row' }}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'50px'}
      >
        <CreateGame />
        <Box
          mt={4}
          sx={{
            width: { xs: '100%', sm: '50%' },
            animation: 'scale 3s ease-in-out infinite',

            '@keyframes scale': {
              '0%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.02)',
              },
              '100%': {
                transform: 'scale(1)',
              },
            },
          }}
        >
          <img src={crown} alt="crown" />
        </Box>
      </Stack>
      <Container
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <GamesList />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'center', sm: 'space-around' }}
          alignItems={'center'}
          paddingY={'50px'}
          gap={2}
          sx={{ width: '100%' }}
        >
          <FriendsList withHeader scroll />
          <PastGames />
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
