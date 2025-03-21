import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
type Props = {};

const GamesList = (props: Props) => {
  const games = useAppSelector((state) => state.socketData.gamesList);
  const nagivate = useNavigate();
  const { socket } = useSocket();

  const handleJoinGame = (gameId: string) => {
    socket?.emit('joinGame', { gameId }, (gameId: string) => {
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
    socket?.emit('requestGamesList');
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
                <TableCell sx={tableCellSx}>Ranking</TableCell>
                <TableCell sx={tableCellSx}>Type</TableCell>
                <TableCell sx={tableCellSx}>Time + Increase</TableCell>
                <TableCell sx={tableCellSx}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game, index) => (
                <TableRow key={index}>
                  <TableCell>{game.owner.username}</TableCell>
                  <TableCell>{game.owner?.rating || '-'}</TableCell>
                  <TableCell>
                    <Stack>
                      {getGameTypeIcon(game.type)}

                      <Typography color="text.primary" variant="caption">
                        {game.type}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{game.tempo}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        handleJoinGame(game.gameId);
                      }}
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
    </>
  );
};

const tableCellSx = {
  fontWeight: 'bold',
  color: 'text.secondary',
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderBottomColor: 'secondary.main',
};
export default GamesList;
