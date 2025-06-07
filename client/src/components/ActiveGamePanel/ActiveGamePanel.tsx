import {
  Alert,
  Box,
  Button,
  ButtonGroup,
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
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';

type Props = {
  gameState: GameState | null;
  timer: { owner: number; opponent: number };
  message: string | null;
  player: {
    id: string;
    username: string;
  } | null;
  handleLeavingGame: () => void;
  handleResign: () => void;
  handleOfferDraw: () => void;
  handleOfferDrawResponse: (isAccepted: boolean) => void;
  handleRematchOffer: () => void;
  handleRematchResponse: (isAccepted: boolean) => void;
};

const ActiveGamePanel = (props: Props) => {
  const {
    gameState,
    timer,
    message,
    handleLeavingGame,
    handleResign,
    handleOfferDraw,
    handleOfferDrawResponse,
    handleRematchOffer,
    handleRematchResponse,
    player,
  } = props;
  const [gameInfo, setGameInfo] = useState<string | null>(null);
  const [confirmResign, setConfirmResign] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const displayInGameInfo = useCallback(() => {
    const gs = gameState;
    if (gs?.gameOver) {
      let reason = null;

      if (gs.whoDisconnected) {
        reason = `Game over by disconnection. Winner: ${
          gs.winner === 'w' ? 'White' : 'Black'
        }.`;
      }
      if (gameState?.checkmate) {
        reason = `Game over by checkmate. Winner: ${
          gs.winner === 'w' ? 'White' : 'Black'
        }.`;
      }
      if (gs.draw) {
        if (gs.stalemate) {
          reason = 'Game ended in a draw by stalemate.';
        } else if (gs.insufficientMaterial) {
          reason = 'Game ended in a draw due to insufficient material.';
        } else if (gs.threefoldRepetition) {
          reason = 'Game ended in a draw by threefold repetition.';
        } else if (gs.fiftyMoveRule) {
          reason = 'Game ended in a draw by the fifty-move rule.';
        } else {
          reason = 'Game ended in a draw.';
        }
      } else if (gs.winner) {
        if (gs.checkmate) {
          reason = `Game over by checkmate. Winner: ${
            gs.winner === 'w' ? 'White' : 'Black'
          }.`;
        } else if (gs.endedByTimeout) {
          reason = `Game over by timeout. Winner: ${
            gs.winner === 'w' ? 'White' : 'Black'
          }.`;
        } else if (gs.whoResigned) {
          reason = `Game over by resignation. Winner: ${
            gs.winner === 'w' ? 'White' : 'Black'
          }.`;
        } else {
          reason = `Game over. Winner: ${
            gs.winner === 'w' ? 'White' : 'Black'
          }.`;
        }
      }
      setGameInfo(reason);
    } else if (
      !gs?.owner?.connected ||
      (!gs?.opponent?.connected && gs.hasStarted)
    ) {
      const message = !gs?.owner.connected
        ? 'The owner has disconnected. Aborting in 15sec...'
        : 'The opponent has disconnected. Aborting in 15sec...';
      setGameInfo(message);
    } else {
      setGameInfo(null);
    }
  }, [gameState]);

  useEffect(() => {
    displayInGameInfo();
  }, [displayInGameInfo]);

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  const whomTurnItIs = () => {
    if (gameState?.turn === gameState?.owner?.color) {
      return 'owner';
    } else {
      return 'opponent';
    }
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

            width: '100%',
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
              gap={5}
              width={'100%'}
            >
              <Stack>
                <Typography variant="h6" color="text.primary">
                  {(gameState?.opponent?.username ?? 'Opponent').length > 10
                    ? `${gameState?.opponent?.username.slice(0, 10)}...`
                    : gameState?.opponent?.username ?? 'Opponent'}
                </Typography>
                <Typography
                  variant="caption"
                  fontStyle={'italic'}
                  color="text.secondary"
                >
                  {gameState?.opponent?.rating ?? '-'}
                </Typography>
              </Stack>
              <Chip
                variant="outlined"
                color={whomTurnItIs() === 'owner' ? 'secondary' : 'primary'}
                label={`${Math.floor(timer.opponent / 60)
                  .toString()
                  .padStart(2, '0')}:${(timer.opponent % 60)
                  .toString()
                  .padStart(2, '0')}`}
              />
            </Stack>

            <Divider flexItem />

            <Stack alignItems={'center'} gap={'5px'}>
              <Stack direction="row" gap={'10px'}>
                {gameState?.hasStarted && !gameState?.gameOver ? (
                  <>
                    {gameState.drawOfferedById !== null ? (
                      gameState.drawOfferedById === player?.id ? (
                        <Button variant="outlined" disabled>
                          Draw offer sent
                        </Button>
                      ) : (
                        <ButtonGroup size="small" variant="contained">
                          <Button onClick={() => handleOfferDrawResponse(true)}>
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleOfferDrawResponse(false)}
                          >
                            Decline
                          </Button>
                        </ButtonGroup>
                      )
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleOfferDraw}
                      >
                        Offer Draw
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        if (confirmResign) {
                          handleResign();
                        } else {
                          setConfirmResign(true);
                          timeoutRef.current = setTimeout(
                            () => setConfirmResign(false),
                            5000
                          );
                        }
                      }}
                    >
                      {confirmResign ? 'Sure?' : 'Resign'}
                    </Button>
                  </>
                ) : null}
                {gameState?.gameOver ? (
                  gameState.rematchOfferedById !== null ? (
                    gameState.rematchOfferedById === player?.id ? (
                      <Button variant="outlined" disabled>
                        Rematch offer sent
                      </Button>
                    ) : (
                      <ButtonGroup size="small" variant="contained">
                        <Button onClick={() => handleRematchResponse(true)}>
                          Accept
                        </Button>
                        <Button onClick={() => handleRematchResponse(false)}>
                          Decline
                        </Button>
                      </ButtonGroup>
                    )
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleRematchOffer}
                    >
                      Rematch
                    </Button>
                  )
                ) : null}
                {(!gameState?.hasStarted || gameState.gameOver) && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      handleLeavingGame();
                      setGameInfo(null);
                    }}
                  >
                    Leave
                  </Button>
                )}
              </Stack>
              {gameInfo && (
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    {gameInfo}
                  </Typography>
                </Box>
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
              <Stack>
                <Typography variant="h6" color="text.primary">
                  {(gameState?.owner.username ?? 'Owner').length > 10
                    ? `${gameState?.owner.username.slice(0, 10)}...`
                    : gameState?.owner.username}
                </Typography>
                <Typography
                  variant="caption"
                  fontStyle={'italic'}
                  color="text.secondary"
                >
                  {gameState?.owner.rating ?? '-'}
                </Typography>
              </Stack>
              <Chip
                variant="outlined"
                color={whomTurnItIs() === 'owner' ? 'primary' : 'secondary'}
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
      {/* {!gameState?.opponent && (
        <Alert variant="outlined" severity="info" sx={{ mt: 2, width: '100%' }}>
          Waiting for others to connect...
        </Alert>
      )} */}
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
