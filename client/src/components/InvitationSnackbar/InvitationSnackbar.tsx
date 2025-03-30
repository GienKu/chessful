import {
  Box,
  Button,
  ButtonGroup,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';

type Props = {
  invitation: {
    gameId: string;
    tempo: `${number}+${number}`;
    type: string;
    color: 'w' | 'b';
    invitedBy: { id: string; username: string };
    ranked: boolean;
  };
  handleInvitationResponse: (isAccepted: boolean) => void;
};

const InvitationSnackbar = ({
  invitation,
  handleInvitationResponse,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState(30); // Example initial value
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeftRef.current <= 0) {
        handleInvitationResponse(false);
        console.log('decline');
        clearInterval(interval);
      } else {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={true}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <Stack p={'20px'} alignItems={'center'} gap={'10px'}>
          <Typography>
            <>
              Invitation from{' '}
              <Typography
                component="span"
                color="text.secondary"
                fontStyle="italic"
              >
                {invitation.invitedBy.username}
              </Typography>{' '}
              for a{' '}
              <Typography
                component="span"
                color="text.secondary"
                fontStyle="italic"
              >
                {invitation.type}
              </Typography>{' '}
              {invitation.ranked ? (
                <Typography
                  component="span"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  ranked
                </Typography>
              ) : (
                <Typography
                  component="span"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  casual
                </Typography>
              )}{' '}
              game (
              <Typography
                component="span"
                color="text.secondary"
                fontStyle="italic"
              >
                {invitation.tempo}
              </Typography>
              )
            </>
          </Typography>

          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleInvitationResponse(true)}
            >
              <DoneIcon />
            </Button>
            <Button
              color="secondary"
              onClick={() => handleInvitationResponse(false)}
            >
              <CloseIcon />
            </Button>
          </ButtonGroup>
        </Stack>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={(timeLeft / 30) * 100} />
        </Box>
      </Paper>
    </Snackbar>
  );
};

export default InvitationSnackbar;
