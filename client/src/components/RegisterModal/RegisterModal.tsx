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

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterModal = ({ open, setOpen }: Props) => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    apiErrors: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      [`${name}Error`]: '',
    }));
  };

  const validateFields = () => {
    let isValid = true;
    const errors: any = {};

    if (formState.username.length < 3) {
      errors.usernameError = 'Username must be at least 3 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      errors.emailError = 'Invalid email address';
      isValid = false;
    }

    if (formState.password.length < 8) {
      errors.passwordError = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formState.confirmPassword !== formState.password) {
      errors.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    setFormState((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateFields()) {
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      apiErrors: [],
    }));

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formState.username,
            email: formState.email,
            password: formState.password,
          }),
        }
      );

      if (response.ok) {
        console.log('Registration successful');
        setOpen(false);
      } else {
        const errorData: ApiErrorResponse = await response.json();
        console.error('Registration error:', errorData);
        setFormState((prevState) => ({
          ...prevState,
          apiErrors: errorData.messages,
        }));
      }
    } catch (error) {
      console.error('Network error:', error);
      setFormState((prevState) => ({
        ...prevState,
        apiErrors: ['Network error, please try again later.'],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            Register
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formState.username}
            onChange={handleChange}
            error={!!formState.usernameError}
            helperText={formState.usernameError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formState.email}
            onChange={handleChange}
            error={!!formState.emailError}
            helperText={formState.emailError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formState.password}
            onChange={handleChange}
            error={!!formState.passwordError}
            helperText={formState.passwordError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formState.confirmPassword}
            onChange={handleChange}
            error={!!formState.confirmPasswordError}
            helperText={formState.confirmPasswordError}
          />
          {formState.apiErrors && formState.apiErrors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {formState.apiErrors.map((error, index) => (
                <Alert key={index} severity="error" variant="outlined">
                  {error}
                </Alert>
              ))}
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            Register
          </Button>
        </Box>
        <Button
          onClick={() => setOpen(false)}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default RegisterModal;
