import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { ApiErrorResponse } from '../../../../interfaces/ApiResponses';

import { useAuth } from '../../hooks/useAuth';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal = ({ open, setOpen }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState<ApiErrorResponse | null>(
    null
  );
  const { userLogin } = useAuth();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorResponse(null); // Clear previous error message
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        userLogin(data.data);
        setOpen(false);
      } else {
        const errorData = await response.json();
        setErrorResponse(errorData || 'Login failed'); // Set error message
      }
    } catch (error) {
      setErrorResponse({ messages: ['Network error'], details: {} }); // Set network error message
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    // Handle password reset submission
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box>
        <Box
          component="form"
          onSubmit={isPasswordReset ? handlePasswordResetSubmit : handleSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            border: '1px solid',
            borderTopColor: 'secondary.dark',
            borderLeftColor: 'secondary.dark',
            borderRightColor: 'primary.dark',
            borderBottomColor: 'primary.dark',
          }}
        >
          <Typography variant="h6" color="text.primary" component="h2">
            {isPasswordReset ? 'Reset Password' : 'Login'}
          </Typography>
          {errorResponse &&
            errorResponse.messages.map((message, index) => (
              <Alert key={index} severity="error" sx={{ mt: 2 }}>
                {message}
              </Alert>
            ))}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          {!isPasswordReset && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isPasswordReset ? 'Reset Password' : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
            onClick={() => {
              setIsPasswordReset(!isPasswordReset);
              setErrorResponse(null);
              setEmail('');
              setPassword('');
            }}
          >
            {isPasswordReset ? 'Back to Login' : 'Forgot Password?'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
