import {
  Alert,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import { GameState } from '../../types/types';

type Props = {
  gameState: GameState | null;
  timer: { owner: number; opponent: number };
  message: string | null;
  player: {
    id: string;
    username: string;
  } | null;
  leaveGame: () => void;
};

const ActiveGamePanel = (props: Props) => {
  const { gameState, timer, message, leaveGame, player } = props;

  const isPlayerTurn = () => {
    const playerToMove =
      player?.id === gameState?.owner?.id
        ? gameState?.owner
        : gameState?.opponent;
    return playerToMove?.color === gameState?.turn;
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'blitz':
        return (
          <Tooltip title="Blitz">
            <LocalFireDepartmentIcon />
          </Tooltip>
        );
      case 'classical':
        return (
          <Tooltip title="Classical">
            <HourglassEmptyIcon />
          </Tooltip>
        );
      case 'rapid':
        return (
          <Tooltip title="Rapid">
            <RocketLaunchIcon />
          </Tooltip>
        );
      case 'bullet':
        return (
          <Tooltip title="Bullet">
            <BoltIcon />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <Stack alignItems={'center'} sx={{ scale: { xs: 0.85, sm: 1 } }}>
      <Stack direction={'row'} gap={1}>
        <Paper sx={{ p: '20px' }}>
          <Stack
            justifyContent={'space-between'}
            alignItems={'center'}
            height={'100%'}
            gap={1}
          >
            {gameState?.type && getGameTypeIcon(gameState?.type)}
            <Typography variant="body1" color="text.secondary">
              {gameState?.tempo}
            </Typography>
            {gameState?.ranked ? (
              <Tooltip title="Ranked">
                <SwitchAccessShortcutAddIcon />
              </Tooltip>
            ) : null}
          </Stack>
        </Paper>
        <Paper
          sx={{
            p: '15px',
            
            width:'100%',
            border: '1px solid',
            borderTopColor: 'secondary.dark',
            borderLeftColor: 'secondary.dark',
            borderRightColor: 'primary.dark',
            borderBottomColor: 'primary.dark',
          }}
        >
          <Stack
            gap={2}
            alignItems="center"
            justifyContent={'center'}
            sx={{
              width: '100%',
              flexDirection:
                player?.id === gameState?.opponent?.id
                  ? 'column-reverse'
                  : undefined,
            }}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={1}
              width={'100%'}
            >
              <Typography variant="h6" color="text.primary">
                {gameState?.opponent?.username ?? 'Opponent'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {gameState?.opponent?.rating}
              </Typography>
              <Chip
                sx={{ color: isPlayerTurn() ? 'primary.main' : undefined }}
                variant="outlined"
                color="secondary"
                label={`${Math.floor(timer.opponent / 60)
                  .toString()
                  .padStart(2, '0')}:${(timer.opponent % 60)
                  .toString()
                  .padStart(2, '0')}`}
              />
            </Stack>

            <Divider flexItem />

            <Stack direction="row" gap={'10px'}>
              {gameState?.hasStarted ? (
                <>
                  <Button size="small" variant="contained" onClick={() => {}}>
                    Draw
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => {}}
                  >
                    Resign
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    leaveGame();
                  }}
                >
                  Leave
                </Button>
              )}
            </Stack>

            <Divider flexItem />

            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={1}
              width={'100%'}
            >
              <Typography variant="h6" color="text.primary">
                {gameState?.owner.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {gameState?.owner.rating}
              </Typography>
              <Chip
                variant="outlined"
                color="secondary"
                label={`${Math.floor(timer.owner / 60)
                  .toString()
                  .padStart(2, '0')}:${(timer.owner % 60)
                  .toString()
                  .padStart(2, '0')}`}
              />
            </Stack>
          </Stack>
        </Paper>
      </Stack>
      {!gameState?.opponent && (
        <Alert variant="outlined" severity="info" sx={{ mt: 2, width: '100%' }}>
          Waiting for others to connect...
        </Alert>
      )}
      {message && (
        <Alert variant="outlined" severity="info" sx={{ mt: 2, width: '100%' }}>
          {message}
        </Alert>
      )}
      {/* {
          <Snackbar>
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          </Snackbar>
        } */}
    </Stack>
  );
};

export default ActiveGamePanel;
