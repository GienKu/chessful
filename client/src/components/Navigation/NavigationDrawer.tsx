import React, { use } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationDrawer = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRight: '1px solid', borderColor: 'primary.main' },
          },
        }}
      >
        <Box role="presentation" sx={{ width: 250, pt: '75px' }}>
          <List>
            <ListItem
              sx={{
                cursor: 'pointer',
                ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
              onClick={() => {
                navigate('/');
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <SportsEsportsIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={'Play'} />
            </ListItem>

            <ListItem
              component="div"
              sx={{
                cursor: authState.user ? 'pointer' : 'default',
                ':hover': authState.user
                  ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  : undefined,
                opacity: authState.user ? 1 : 0.5,
                pointerEvents: authState.user ? 'auto' : 'none',
              }}
            >
              <ListItemIcon>
                <ManageSearchIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={'Profile'} />
            </ListItem>

            <ListItem
              component="div"
              sx={{
                cursor: authState.user ? 'pointer' : 'default',
                ':hover': authState.user
                  ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  : undefined,
                opacity: authState.user ? 1 : 0.5,
                pointerEvents: authState.user ? 'auto' : 'none',
              }}
              onClick={() => {
                if (authState.user) {
                  navigate('/friends');
                  setOpen(false);
                }
              }}
            >
              <ListItemIcon>
                <PeopleAltIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={'Friends'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
