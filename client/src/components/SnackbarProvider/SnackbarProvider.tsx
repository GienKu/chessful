import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useSnackbar } from '../../hooks/useSnackbar';

type Props = {
  children: React.ReactNode;
};

const SnackbarProvider = ({ children }: Props) => {
  const { message, isOpen, severity, hideSnackbar } = useSnackbar();
  return (
    <>
      {children}
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => hideSnackbar()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => hideSnackbar()}
          severity={severity ?? 'info'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackbarProvider;
