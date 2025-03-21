import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          height: '100%',
        }}
        bgcolor="background.default"
      >
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
