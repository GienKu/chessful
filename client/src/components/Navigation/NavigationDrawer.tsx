import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import { Box } from '@mui/material';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationDrawer = ({ open, setOpen }: Props) => {
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
            >
              <ListItemIcon>
                <SportsEsportsIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={'Play'} />
            </ListItem>

            <ListItem
              sx={{
                cursor: 'pointer',
                ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              <ListItemIcon>
                <ManageSearchIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={'Analyze games'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
