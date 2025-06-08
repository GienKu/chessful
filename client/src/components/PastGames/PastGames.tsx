import { useEffect, useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  Button,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';

import board from '../../assets/chess-board.svg';
import { FinishedGame } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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

const PastGames = () => {
  const {
    authState: { user },
  } = useAuth();
  const [games, setGames] = useState<FinishedGame[]>([]);
  const navigate = useNavigate();

  const handleAnalyzeButtonClick = (gameId: string) => {
    navigate(`/analyze-game/${gameId}`);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (!user) {
          setGames([]);
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/get-games/${user.id}`,
          {
            method: 'GET',
          }
        );
        if (!res.ok) {
          console.error(res.statusText);
          return;
        }
        const { data } = await res.json();
        setGames(data.games);
      } catch (error) {
        // console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [user]);
  return (
    <Paper
      elevation={10}
      sx={{
        borderColor: 'primary.main',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px',
        minHeight: '400px',
      }}
    >
      <Box
        bgcolor={'secondary.main'}
        color={'primary.contrastText'}
        padding={'10px 0'}
        sx={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h5" fontWeight={'bold'} textAlign={'center'}>
          Past Games
        </Typography>
      </Box>
      {user === null ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          padding="20px"
        >
          <Box
            border="1px solid"
            borderColor="secondary.main"
            borderRadius="8px"
            padding="20px"
            textAlign="center"
            width={'100%'}
          >
            <Typography variant="h6" color="secondary" fontWeight="bold">
              Welcome to Chessful!
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Log in to view your games.
            </Typography>
          </Box>
        </Box>
      ) : games.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          padding="20px"
        >
          <Typography variant="body1" color="text.secondary">
            No games to display.
          </Typography>
        </Box>
      ) : (
        <List
          sx={{
            overflowY: 'auto',
            maxHeight: '500px',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'primary.dark',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'background.default',
            },
          }}
        >
          {games.map((game) => (
            <ListItem
              key={game.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'10px'}
                width={'100%'}
              >
                <img src={board} alt="Chess board" width={40} height={40} />

                <Stack alignItems="center">
                  {getGameTypeIcon(game.gameType)}

                  <Typography color="text.secondary" variant="caption">
                    {game.gameType}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="body2">
                    {game.winner === 'w' ? (
                      <strong>
                        {game.whitePlayer.length > 10
                          ? `${game.whitePlayer.slice(0, 10)}...`
                          : game.whitePlayer}{' '}
                        ({game.whiteRating ?? 'N/A'})
                      </strong>
                    ) : (
                      `${
                        game.whitePlayer.length > 10
                          ? `${game.whitePlayer.slice(0, 10)}...`
                          : game.whitePlayer
                      } (${game.whiteRating ?? 'N/A'})`
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {game.winner === 'b' ? (
                      <strong>
                        {game.blackPlayer.length > 10
                          ? `${game.blackPlayer.slice(0, 10)}...`
                          : game.blackPlayer}{' '}
                        ({game.blackRating ?? 'N/A'})
                      </strong>
                    ) : (
                      `${
                        game.blackPlayer.length > 10
                          ? `${game.blackPlayer.slice(0, 10)}...`
                          : game.blackPlayer
                      } (${game.blackRating ?? 'N/A'})`
                    )}
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAnalyzeButtonClick(game.id)}
                >
                  Analyze
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default PastGames;
