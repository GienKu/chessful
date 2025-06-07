import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        height: '25px',
        textAlign: 'center',
        bgcolor: 'background.paper',
        p: 5,
        borderTop: '1px solid',
        borderTopColor: 'secondary.main',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {new Date().getFullYear()} Chessful - Cool chess app
      </Typography>
    </Box>
  );
};

export default Footer;
