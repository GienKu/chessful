import { FormEvent, useState } from 'react';
import {
  Container,
  Typography,
  MenuItem,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Box,
  Paper,
  Stack,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  Divider,
} from '@mui/material';
import crown from '../assets/crown.png';
import FriendsList from '../components/FriendsList/FriendsList';
import PastGames from '../components/PastGames/PastGames';

import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';

const Home = () => {
  const [games, setGames] = useState<
    { time: number; addedTime: number; color: string; type: string }[]
  >([]);
  const [time, setTime] = useState(10);
  const [addedTime, setAddedTime] = useState(5);
  const [color, setColor] = useState('white');

  const handleCreateGame = (e: FormEvent) => {
    e.preventDefault();
    setTime(10);
    setAddedTime(5);
    const gameType =
      time <= 3
        ? 'bullet'
        : time <= 10
        ? 'blitz'
        : time <= 30
        ? 'rapid'
        : 'classical';
    const newGame = { time, addedTime, color, type: gameType };
    setGames([...games, newGame]);
    setColor('white');
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'blitz':
        return <LocalFireDepartmentIcon />;
      case 'classical':
        return <HourglassEmptyIcon />;
      case 'rapid':
        return <RocketLaunchIcon />;
      case 'bullet':
        return <BoltIcon />;
      default:
        return null;
    }
  };
  return (
    <Box sx={{ m: 0 }}>
      <Stack
        sx={{ background: 'linear-gradient(to bottom, black, #121212)' }}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-around'}
        gap={3}
      >
        <Paper
          elevation={10}
          sx={{
            p: '15px',
            maxWidth: '320px',
            width: '50%',
            border: '1px solid',
            borderTopColor: 'secondary.dark',
            borderLeftColor: 'secondary.dark',
            borderRightColor: 'primary.dark',
            borderBottomColor: 'primary.dark',
          }}
        >
          <form onSubmit={handleCreateGame}>
            <Stack gap={'5px'}>
              <Typography
                color="text.primary"
                component={'h4'}
                fontSize={'26px'}
                textAlign={'center'}
                gutterBottom
              >
                Create game
                <Divider sx={{ mt: '5px' }}></Divider>
              </Typography>
              <Box
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Typography color="text.primary" gutterBottom>
                  Time (minutes):
                </Typography>
                <Slider
                  sx={{ maxWidth: 250 }}
                  color="secondary"
                  value={time}
                  onChange={(e, newValue) => setTime(newValue as number)}
                  step={1}
                  min={1}
                  max={60}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Box
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Typography color="text.primary" gutterBottom>
                  Added Time After Move (seconds):
                </Typography>
                <Slider
                  sx={{ maxWidth: 250 }}
                  color="secondary"
                  value={addedTime}
                  onChange={(e, newValue) => setAddedTime(newValue as number)}
                  step={1}
                  min={0}
                  max={60}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Pieces Color</InputLabel>
                  <Select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <MenuItem value="white">White</MenuItem>
                    <MenuItem value="black">Black</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                sx={{ width: 'max-content', m: '0 auto' }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Let's play
              </Button>
            </Stack>
          </form>
        </Paper>
        <Box
          mt={4}
          sx={{
            width: '50%',
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
        <Typography
          textAlign={'center'}
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Active games
        </Typography>
        <Paper
          sx={{
            width: '95%',
            minHeight: '300px',
            maxHeight: '500px',
            overflow: 'auto',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'secondary.main',
                    }}
                  >
                    Owner Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'secondary.main',
                    }}
                  >
                    Ranking
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'secondary.main',
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'secondary.main',
                    }}
                  >
                    Time + Increase
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'secondary.main',
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game, index) => (
                  <TableRow key={index}>
                    <TableCell>Player {index + 1}</TableCell>
                    <TableCell>1200</TableCell>
                    <TableCell>
                      <Stack>
                        {getGameTypeIcon(game.type)}

                        <Typography color="text.primary" variant="caption">
                          {game.type}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {game.time} + {game.addedTime}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                      >
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Stack
          direction={'row'}
          justifyContent={'space-around'}
          paddingY={'50px'}
          gap={2}
          sx={{ width: '100%' }}
        >
          <FriendsList />
          <PastGames />
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
