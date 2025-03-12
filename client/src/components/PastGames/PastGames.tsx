import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Divider,
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

type Props = {};

const pastGamesData = [
  {
    id: 1,
    player1: 'Alice (1500)',
    player2: 'Bob (1450)',
    winner: 'Alice',
    type: 'blitz',
  },
  {
    id: 2,
    player1: 'Charlie (1600)',
    player2: 'Dave (1550)',
    winner: 'Dave',
    type: 'classical',
  },
  {
    id: 3,
    player1: 'Eve (1700)',
    player2: 'Frank (1650)',
    winner: 'Eve',
    type: 'rapid',
  },
  {
    id: 4,
    player1: 'Grace (1800)',
    player2: 'Heidi (1750)',
    winner: 'Grace',
    type: 'bullet',
  },
  {
    id: 5,
    player1: 'Ivan (1900)',
    player2: 'Judy (1850)',
    winner: 'Ivan',
    type: 'blitz',
  },
];

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

const PastGames = (props: Props) => {
  return (
    <Paper
      elevation={10}
      sx={{
        borderColor: 'primary.main',
        borderRadius: '10px',
        width: '50%',
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
      <List>
        {pastGamesData.slice(0, 5).map((game) => (
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
                {getGameTypeIcon(game.type)}

                <Typography color="text.secondary" variant="caption">
                  {game.type}
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="body2">
                  {game.winner === game.player1.split(' ')[0] ? (
                    <strong>{game.player1}</strong>
                  ) : (
                    game.player1
                  )}
                </Typography>
                <Typography variant="body2">
                  {game.winner === game.player2.split(' ')[0] ? (
                    <strong>{game.player2}</strong>
                  ) : (
                    game.player2
                  )}
                </Typography>
              </Stack>
              <Button variant="outlined" size="small">
                Analyze
              </Button>
            </Stack>
          </ListItem>
        ))}
        {/* <Divider /> */}
        <ListItem sx={{ justifyContent: 'center' }}>
          <Button  variant="text" size='small' color="primary">
            More
          </Button>
        </ListItem>
      </List>
    </Paper>
  );
};

export default PastGames;
