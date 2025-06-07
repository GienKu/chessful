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
  ButtonGroup,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from '../../hooks/useSnackbar';

type Props = {};

const FriendInvitationList = (props: Props) => {
  const navigate = useNavigate();
  const {
    authState: { user },
  } = useAuth();

  const { showSnackbar } = useSnackbar();

  const [invitations, setInvitations] = useState<
    {
      id: string;
      sender: { username: string };
    }[]
  >([]);

  const handleInvitationClick = async (
    invitationId: string,
    isAccepted: boolean
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/invitation-response`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: invitationId,
            isAccepted,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
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

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/invitations?id=${user.id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (res.ok) {
          const { data } = await res.json();
          setInvitations(data.invitations);
        } else {
          console.error('Failed to fetchh Invitations:', res.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching Invitations:', error);
      }
    };

    fetchInvitations();
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
        bgcolor={'primary.main'}
        color={'primary.contrastText'}
        padding={'10px 0'}
        sx={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
        }}
      ></Box>
      {invitations.length > 0 ? (
        <List sx={{}}>
          {invitations.map((invitation, index) => (
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
                      navigate(`/player/${index}`);
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
                      {invitation.sender.username}
                    </Typography>
                  </Stack>
                  <ButtonGroup size="small" variant="contained">
                    <Button
                      color="primary"
                      onClick={() => handleInvitationClick(invitation.id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={() =>
                        handleInvitationClick(invitation.id, false)
                      }
                    >
                      Decline
                    </Button>
                  </ButtonGroup>
                </Stack>
              </ListItem>
              <Divider sx={{ mx: '10px' }} />
            </div>
          ))}
        </List>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          You don't have any invitations.
        </Typography>
      )}
    </Paper>
  );
};

export default FriendInvitationList;
