import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import NavigationDrawer from '../components/Navigation/NavigationDrawer';
import { Box, Divider, Stack } from '@mui/material';
import logo from '../assets/logo.png';
import Button from '@mui/material/Button';
import LoginModal from '../components/LoginModal/LoginModal';
import RegisterModal from '../components/RegisterModal/RegisterModal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { authState, userLogout } = useAuth();
  const guestId = localStorage.getItem('guestId');
  return (
    <Box sx={{ position: 'relative', zIndex: 9999 }}>
      <AppBar
        sx={{
          borderBottom: '1px solid',
          borderColor: 'secondary.main',
        }}
        elevation={10}
        component={'header'}
        position="static"
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'space-between' },
          }}
        >
          <Stack direction="row" spacing={1}>
            <img
              src={logo}
              alt="logo"
              style={{ height: '30px', marginRight: '10px' }}
            />
            <Typography
              variant="h6"
              sx={{
                cursor: 'pointer',
                display: { xs: 'none', sm: 'flex' },
              }}
              onClick={() => {
                navigate('/');
              }}
            >
              {['C', 'h', 'e', 's', 's', 'f', 'u', 'l'].map((letter, index) => (
                <Box
                  key={index}
                  component={'span'}
                  fontWeight={'bold'}
                  color={index < 5 ? 'primary.main' : 'secondary.main'}
                >
                  {letter}
                </Box>
              ))}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems={'center'} gap={2}>
            {authState.user ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => userLogout()}
                >
                  Logout
                </Button>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="body1" color="inherit">
                    {authState.user.username}
                  </Typography>
                  <IconButton color="inherit">
                    <AccountCircleIcon />
                  </IconButton>
                </Stack>
              </>
            ) : (
              <>
                <Typography
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >{`Guest+${guestId}`}</Typography>
                <Divider orientation="vertical" flexItem />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    setLoginModalOpen(true);
                    setRegisterModalOpen(false);
                  }}
                >
                  Login
                </Button>
                <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    setRegisterModalOpen(true);
                    setLoginModalOpen(false);
                  }}
                >
                  Register
                </Button>
                <RegisterModal
                  open={registerModalOpen}
                  setOpen={setRegisterModalOpen}
                />
              </>
            )}
            <Divider orientation="vertical" flexItem />
            <IconButton
              edge="start"
              sx={{}}
              color="primary"
              onClick={() => setNavbarOpen((navbarOpen) => !navbarOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <NavigationDrawer open={navbarOpen} setOpen={setNavbarOpen} />
    </Box>
  );
};

export default Header;
