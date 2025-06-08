import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import { FinishedGame } from '../../types/types';
import { ChessInstance } from 'chess.js';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CachedIcon from '@mui/icons-material/Cached';
import { Params } from '../../pages/AnalyzeGame';
import { StockfishEngine } from '../../stockfish/StockfishEngine';

type Props = {
  gameInfo: FinishedGame | null;
  game: ChessInstance;
  boardOrientation: 'white' | 'black';
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  findBestMove: () => void;
  engine: StockfishEngine | null;
};

const ActiveGamePanel = ({
  gameInfo,
  game,
  boardOrientation,
  params,
  setParams,
  findBestMove,
  engine,
}: Props) => {
  const move = () => {
    const move = params.history[params.currMoveNum];
    const moveResult = game.move(move);

    if (moveResult) {
      setParams((prev) => ({
        ...prev,
        currFen: game.fen(),
        currMoveNum:
          prev.currMoveNum + 1 < params.history.length
            ? prev.currMoveNum + 1
            : prev.currMoveNum,
      }));
      findBestMove();
    }
  };

  const undoMove = () => {
    game.undo();
    setParams((prev) => ({
      ...prev,
      currFen: game.fen(),
      currMoveNum:
        prev.currMoveNum - 1 < 0 ? prev.currMoveNum : prev.currMoveNum - 1,
    }));
    findBestMove();

  };

  const handleAnalyzeChange = () => {

    if (params.isStockfishActive === false) {
      findBestMove();
      setParams((prev) => ({
        ...prev,
        isStockfishActive: true,
      }));
    } else {
      engine?.stop();
      setParams((prev) => ({
        ...prev,
        isStockfishActive: false,
        sfCalculations: null,
      }));
    }
  };

  const changeBoardOrientation = () => {
    setParams((prev) => ({
      ...prev,
      boardOrientation: prev.boardOrientation === 'white' ? 'black' : 'white',
    }));
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
            {gameInfo?.gameType && getGameTypeIcon(gameInfo?.gameType)}
            <Typography variant="body1" color="text.secondary">
              {gameInfo?.tempo}
            </Typography>
            {gameInfo?.ranked ? (
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
                boardOrientation === 'black' ? 'column-reverse' : undefined,
            }}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={1}
              width={'100%'}
            >
              <Stack>
                <Typography variant="h6" color="text.primary">
                  {gameInfo?.blackPlayer && gameInfo.blackPlayer.length > 10
                    ? `${gameInfo?.blackPlayer.substring(0, 10)}...`
                    : gameInfo?.blackPlayer}
                </Typography>
                <Typography
                  variant="caption"
                  fontStyle={'italic'}
                  color="text.secondary"
                >
                  {gameInfo?.blackRating}
                </Typography>
              </Stack>
            </Stack>

            <Divider flexItem />

            <Stack alignItems={'flex-start'} gap={'5px'} width={'100%'}>
              <Stack>
                <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => handleAnalyzeChange()}
                        size="small"
                      />
                    }
                    label="Analyze"
                  />
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="caption" color="text.secondary">
                    Stockfish 17
                  </Typography>
                </Stack>

                {params.isStockfishActive ? (
                  <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >{`Depth: ${
                      params.sfCalculations?.depth || '-'
                    }`}</Typography>

                    <Divider orientation="vertical" flexItem />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >{`Best: ${
                      params.sfCalculations?.pv
                        .split(' ')
                        .splice(0, 3)
                        .join(' - ') || '-'
                    }`}</Typography>
                  </Stack>
                ) : null}
              </Stack>
              <Stack
                direction="row"
                justifyContent={'fflex-start'}
                gap={'10px'}
                width={'100%'}
              >
                <Button onClick={() => changeBoardOrientation()}>
                  <CachedIcon></CachedIcon>
                </Button>

                <ButtonGroup size="small">
                  <Button onClick={() => undoMove()}>
                    <SkipPreviousIcon />
                  </Button>
                  <Button onClick={() => move()}>
                    <SkipNextIcon />
                  </Button>
                </ButtonGroup>
              </Stack>

              <Box>
                <Typography color="text.secondary" variant="caption">
                  {`Game ended by ${gameInfo?.endedBy}. Winner: ${
                    gameInfo?.winner === 'w' ? 'white' : 'black'
                  }`}
                </Typography>
              </Box>
            </Stack>

            <Divider flexItem />

            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={5}
              width={'100%'}
            >
              <Stack>
                <Typography variant="h6" color="text.primary">
                  {gameInfo?.whitePlayer && gameInfo.whitePlayer.length > 10
                    ? `${gameInfo?.whitePlayer.substring(0, 10)}...`
                    : gameInfo?.whitePlayer}
                </Typography>
                <Typography
                  variant="caption"
                  fontStyle={'italic'}
                  color="text.secondary"
                >
                  {gameInfo?.whiteRating}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default ActiveGamePanel;
