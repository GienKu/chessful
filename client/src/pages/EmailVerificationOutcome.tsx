import React from 'react';
import { Paper, Typography, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  isVerified: boolean;
}

const EmailVerificationOutcome = ({ isVerified }: Props) => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        pt: '50px',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: '30px',
          textAlign: 'center',
          border: '1px solid',
          borderTopColor: 'secondary.dark',
          borderLeftColor: 'secondary.dark',
          borderRightColor: 'primary.dark',
          borderBottomColor: 'primary.dark',
        }}
      >
        {isVerified ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 50, color: 'green' }} />
            <Typography variant="h5">Email verified successfully!</Typography>
            <Typography color="text.secondary" variant="subtitle1">
              You can now access all features.
            </Typography>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 50, color: 'red' }} />
            <Typography variant="h5">Email verification failed.</Typography>
            <Typography color="text.secondary" variant="subtitle1">
              Please try again later.
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default EmailVerificationOutcome;
