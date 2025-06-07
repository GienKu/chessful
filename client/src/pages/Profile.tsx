import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import {
  AccountCircle,
  EmojiEvents,
  GppBad,
  Handshake,
  CalendarMonth,
} from '@mui/icons-material';
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';

// --- Type Definitions (can be moved to a separate types.ts file) ---

interface PlayerData {
  id: string;
  username: string;
  rating: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
  };
  winCount: number;
  lossCount: number;
  drawCount: number;
  createdAt: string;
}

interface GameData {
  id: string;
  whitePlayer: string;
  blackPlayer: string;
  winner: 'w' | 'b' | null;
  gameType: 'bullet' | 'blitz' | 'rapid' | 'classical';
  tempo: string;
  ranked: boolean;
  createdAt: string;
  endedBy: string;
}

// --- Main Profile Component ---

const Profile = () => {
  const { id } = useParams<{ id: string }>(); // Get user ID from URL
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch player summary and games in parallel
        const [playerResponse, gamesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/player/${id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/get-games/${id}`),
        ]);

        if (playerResponse.data.data.user) {
          setPlayerData(playerResponse.data.data.user);
        } else {
          throw new Error('Player not found.');
        }

        if (gamesResponse.data.data.games) {
          setGames(gamesResponse.data.data.games);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch data'
        );
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!playerData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>No player data available.</Typography>
      </Container>
    );
  }

  const ratingData = [
    { type: 'Bullet', rating: playerData.rating.bullet },
    { type: 'Blitz', rating: playerData.rating.blitz },
    { type: 'Rapid', rating: playerData.rating.rapid },
    { type: 'Classical', rating: playerData.rating.classical },
  ];

  const getResult = (game: GameData) => {
    if (game.winner === null) {
      return { text: 'Draw', color: 'default', icon: <Handshake /> };
    }
    const isPlayerWhite = game.whitePlayer === playerData.username;
    const playerWon =
      (isPlayerWhite && game.winner === 'w') ||
      (!isPlayerWhite && game.winner === 'b');

    return playerWon
      ? { text: 'Win', color: 'success', icon: <EmojiEvents /> }
      : { text: 'Loss', color: 'error', icon: <GppBad /> };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Player Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <AccountCircle sx={{ width: 40, height: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {playerData.username}
              </Typography>
              <Box display="flex" alignItems="center" color="text.secondary">
                <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  Member since{' '}
                  {new Date(playerData.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Win/Loss/Draw Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Game Outcomes
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: playerData.winCount,
                      label: `Wins (${(
                        (playerData.winCount /
                          (playerData.winCount +
                            playerData.lossCount +
                            playerData.drawCount)) *
                        100
                      ).toFixed(1)}%)`,
                      color: '#4caf50',
                    },
                    {
                      id: 1,
                      value: playerData.lossCount,
                      label: `Losses (${(
                        (playerData.lossCount /
                          (playerData.winCount +
                            playerData.lossCount +
                            playerData.drawCount)) *
                        100
                      ).toFixed(1)}%)`,
                      color: '#f44336',
                    },
                    {
                      id: 2,
                      value: playerData.drawCount,
                      label: `Draws (${(
                        (playerData.drawCount /
                          (playerData.winCount +
                            playerData.lossCount +
                            playerData.drawCount)) *
                        100
                      ).toFixed(1)}%)`,
                      color: '#9e9e9e',
                    },
                  ],
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'gray',
                  },
                  innerRadius: 30,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              height={200}
            />
          </Paper>
        </Grid>

        {/* Ratings Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Ratings
            </Typography>
            <BarChart
              dataset={ratingData}
              xAxis={[{ scaleType: 'band', dataKey: 'type' }]}
              series={[
                { dataKey: 'rating', label: 'Rating', color: '#1976d2' },
              ]}
              height={250}
              margin={{ top: 10, right: 30, bottom: 30, left: 40 }}
            />
          </Paper>
        </Grid>

        {/* Recent Games Table */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Recent Games
            </Typography>
            <TableContainer sx={{ width: { xs: '300px', sm: '100%' } }}>
              <Table size="small" sx={{ width: { xs: '300px', sm: '100%' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Opponent</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {games.slice(0, 10).map((game) => {
                    const opponent =
                      game.whitePlayer === playerData.username
                        ? game.blackPlayer
                        : game.whitePlayer;
                    const result = getResult(game);

                    return (
                      <TableRow
                        sx={{ cursor: 'pointer' }}
                        hover
                        key={game.id}
                        onClick={() => {
                          navigate(`/analyze-game/${game.id}`);
                        }}
                      >
                        <TableCell>{opponent}</TableCell>
                        <TableCell>
                          <Chip
                            icon={result.icon}
                            label={result.text}
                            color={result.color as any}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {game.gameType} ({game.tempo})
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {game.ranked ? (
                            <Tooltip title="Ranked Game">
                              <Chip
                                icon={<SwitchAccessShortcutAddIcon />}
                                label="Ranked"
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </Tooltip>
                          ) : (
                            <Chip label="Unranked" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(game.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {games.length === 0 && (
              <Typography
                sx={{ mt: 2, textAlign: 'center' }}
                color="text.secondary"
              >
                No games played yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
