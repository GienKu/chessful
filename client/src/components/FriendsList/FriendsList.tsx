import { useEffect, useState } from 'react';
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
  Tooltip,
  Modal,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CreateGame from '../CreateGame/CreateGame';

type Props = {
  scroll?: boolean;
  withHeader?: boolean;
};

type Friend = {
  id: string;
  username: string;
  rating: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
  };
  totalGames: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  createdAt: string;
};

const FriendsList = (props: Props) => {
  const navigate = useNavigate();
  const {
    authState: { user },
  } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newGameModalOpen, setNewGameModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/friends?id=${user.id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (res.ok) {
          const { data } = await res.json();
          setFriends(data.userFriends);
        } else {
          // console.error('Failed to fetchh Friends:', res.statusText);
        }
      } catch (error) {
        // console.error('An error occurred while fetching Friends:', error);
      }
    };

    fetchFriends();
  }, [user]);

  return (
    <Paper
      elevation={10}
      sx={{
        borderColor: 'primary.main',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '100%',
        minHeight: '400px',
      }}
    >
      <Box
        bgcolor={'primary.main'}
        color={'primary.contrastText'}
        padding={'10px 0'}
        sx={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
        }}
      >
        {props.withHeader && (
          <Typography variant="h5" fontWeight={'bold'} textAlign={'center'}>
            Friends
          </Typography>
        )}
      </Box>
      {user == null ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          padding="20px"
        >
          <Box
            border="1px solid"
            borderColor="primary.main"
            borderRadius="8px"
            padding="20px"
            textAlign="center"
            width={'100%'}
          >
            <Typography variant="h6" color="primary" fontWeight="bold">
              Welcome to Chessful!
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Log in to view and connect with your friends.
            </Typography>
          </Box>
        </Box>
      ) : (
        <List
          sx={{
            ...(props.scroll && {
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
            }),
          }}
        >
          {friends.map((friend, index) => (
            <div key={index}>
              <ListItem
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap={'10px'}
                  width={'100%'}
                >
                  <Stack
                    justifyContent={'center'}
                    alignItems={'center'}
                    width={'100px'}
                    sx={{
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => navigate(`/player/${friend.id}`)}
                  >
                    <ListItemIcon sx={{ justifyContent: 'center' }}>
                      <PersonIcon
                        sx={{
                          width: '40px',
                          height: '40px',
                          p: '5px',
                          borderRadius: '50%',
                        }}
                      />
                    </ListItemIcon>
                    <Typography
                      lineHeight={1}
                      variant={'body1'}
                      color="text.secondary"
                      textAlign={'center'}
                    >
                      {friend.username}
                    </Typography>
                  </Stack>

                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={1}
                    justifyItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        title="Classical"
                      >
                        <Tooltip title="Classical">
                          <HourglassEmptyIcon
                            fontSize="small"
                            color={'secondary'}
                          />
                        </Tooltip>
                        <Typography variant="caption">
                          {friend.rating.classical}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        title="Rapid"
                      >
                        <Tooltip title="Rapid">
                          <RocketLaunchIcon
                            fontSize="small"
                            color={'primary'}
                          />
                        </Tooltip>
                        <Typography variant="caption">
                          {friend.rating.rapid}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        title="Bullet"
                      >
                        <Tooltip title="Bullet">
                          <BoltIcon fontSize="small" color={'primary'} />
                        </Tooltip>
                        <Typography variant="caption">
                          {friend.rating.bullet}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        title="Blitz"
                      >
                        <Tooltip title="Blitz">
                          <LocalFireDepartmentIcon
                            fontSize="small"
                            color={'secondary'}
                          />
                        </Tooltip>
                        <Typography variant="caption">
                          {friend.rating.blitz}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setNewGameModalOpen(true);
                      setSelectedFriend(friend);
                    }}
                  >
                    Invite
                  </Button>
                </Stack>
              </ListItem>
              {<Divider sx={{ mx: '10px' }} />}
            </div>
          ))}
        </List>
      )}
      <Modal
        open={newGameModalOpen}
        onClose={() => {
          setNewGameModalOpen(false);
          setSelectedFriend(null);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '320px',
          }}
        >
          <CreateGame
            invitedPlayerId={selectedFriend?.id}
            invitedPlayerUsername={selectedFriend?.username}
          />
        </Box>
      </Modal>
    </Paper>
  );
};

export default FriendsList;
