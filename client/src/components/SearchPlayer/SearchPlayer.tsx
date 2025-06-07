import React from 'react';
import {
  TextField,
  List,
  ListItem,
  Box,
  Stack,
  ListItemIcon,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from '../../hooks/useSnackbar';


const SearchPlayer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<{ id: string; username: string }[]>(
    []
  );
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/players?username=${searchTerm}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (res.ok) {
        const { data } = await res.json();
        setPlayers(data.users);
      }
    } catch (error) {
      showSnackbar('Failed to fetch players', 'error');
    }
  };

  const sendInvitation = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/send-friend-invitation`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();

        setPlayers((prev) => prev.filter((usr) => usr.id !== id));
        showSnackbar(data.message, 'success');
      } else {
        // Handle non-ok responses
        const errorData = await res.json();
        showSnackbar(errorData.messages[0], 'error');
      }
    } catch (error) {
      showSnackbar('Network error', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
      <TextField
        variant="outlined"
        label="Search Player"
        fullWidth
        value={searchTerm}
        onChange={onInputChange}
        slotProps={{
          input: {
            endAdornment: (
              <SearchIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => handleSearch()}
              />
            ),
          },
        }}
      />
      {players.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mt={2}
        >
          No players found.
        </Typography>
      ) : (
        <List>
          {players.map((player, index) => (
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
                    direction={'row'}
                    alignItems={'center'}
                    gap={'10px'}
                    onClick={() => {
                      navigate(`/player/${player.id}`);
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon
                        sx={{
                          width: '40px',
                          height: '40px',
                          p: '5px',
                          borderRadius: '50%',
                        }}
                      />
                    </ListItemIcon>
                    <Typography variant={'body1'} color="text.secondary">
                      {player.username}
                    </Typography>
                  </Stack>
                  <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={() => sendInvitation(player.id)}
                  >
                    Invite
                  </Button>
                </Stack>
              </ListItem>
              <Divider sx={{ mx: '10px' }} />
            </div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchPlayer;
