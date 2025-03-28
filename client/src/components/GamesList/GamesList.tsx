import {
  Alert,
  Button,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import { useAppSelector } from '../../features/redux/hooks';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { Game } from '../../features/redux/socketDataSlice';
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';

const GamesList = () => {
  const { playerGames, gamesList } = useAppSelector(
    (state) => state.socketData
  );
  const nagivate = useNavigate();
  const { socket, player } = useSocket();
  const { authState } = useAuth();

  const [message, setMessage] = useState<{
    severity: 'error' | 'info' | 'success' | 'warning';
    msg: string;
  } | null>(null);

  const handleReconnect = (game: Game) => {
    nagivate(`/game/${game.gameId}`);
  };

  const handleJoinGame = (game: Game) => {
    if (authState.user === null && game.ranked === true) {
      setMessage({
        severity: 'info',
        msg: 'You cannot join ranked game as a guest. Please log in',
      });
      return;
    }

    socket?.emit('joinGame', { gameId: game.gameId }, (gameId: string) => {
      nagivate(`/game/${gameId}`);
    });
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

  useEffect(() => {
    if (!socket) return;
    socket.emit('requestGamesList');
    socket.emit('getPlayerGames');
  }, [socket]);
  return (
    <>
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
                <TableCell sx={tableCellSx}>Owner Name</TableCell>
                <TableCell sx={tableCellSx}>Rating</TableCell>
                <TableCell sx={tableCellSx}>Type</TableCell>
                <TableCell sx={tableCellSx}>Tempo</TableCell>
                <TableCell sx={tableCellSx}>Ranked</TableCell>
                <TableCell sx={tableCellSx}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ...playerGames,
                ...gamesList.filter((g) => g.owner.id !== player?.id),
              ].map((game, index) => (
                <TableRow key={index}>
                  <TableCell sx={rowCellSx}>{game.owner.username}</TableCell>
                  <TableCell sx={rowCellSx}>
                    {game.owner?.rating || '-'}
                  </TableCell>
                  <TableCell sx={rowCellSx}>
                    <Stack alignItems={'center'}>
                      {getGameTypeIcon(game.type)}

                      <Typography color="text.primary" variant="caption">
                        {game.type}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={rowCellSx}>{game.tempo}</TableCell>
                  <TableCell sx={rowCellSx}>
                    {game.ranked ? (
                      <Tooltip title="Ranked">
                        <SwitchAccessShortcutAddIcon />
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell sx={rowCellSx}>
                    <Button
                      onClick={() => {
                        game.owner.id === player?.id ||
                        game.opponent?.id === player?.id
                          ? handleReconnect(game)
                          : handleJoinGame(game);
                      }}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      {game.owner.id === player?.id ||
                      game.opponent?.id === player?.id
                        ? 'Reconnect'
                        : 'Join'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.severity}
          sx={{ width: '100%' }}
        >
          {message?.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

const rowCellSx = {
  textAlign: 'center',
};
const tableCellSx = {
  fontWeight: 'bold',
  color: 'text.secondary',
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderBottomColor: 'secondary.main',
  textAlign: 'center',
};
export default GamesList;
