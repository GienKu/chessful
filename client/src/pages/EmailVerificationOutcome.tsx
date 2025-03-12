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
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          textAlign: 'center',
        }}
      >
        {isVerified ? (
          <>
            <CheckCircleIcon style={{ fontSize: 50, color: 'green' }} />
            <Typography variant="h5">Email verified successfully!</Typography>
            <Typography variant="subtitle1">
              You can now access all features.
            </Typography>
          </>
        ) : (
          <>
            <ErrorIcon style={{ fontSize: 50, color: 'red' }} />
            <Typography variant="h5">Email verification failed.</Typography>
            <Typography variant="subtitle1">Please try again later.</Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default EmailVerificationOutcome;
