import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', bgcolor: 'background.paper', p: 5,  borderTop: '1px solid', borderTopColor: 'secondary.main' }}>  
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Chessful. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
