import React, { useState } from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import FriendsList from '../components/FriendsList/FriendsList';
import SearchPlayer from '../components/SearchPlayer/SearchPlayer';
import FriendInvitationList from '../components/FriendInvitationsList/FriendInvitationList';

const Friends = () => {
  const [value, setValue] = useState('1');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <TabList onChange={handleChange} aria-label="Friends tabs">
          <Tab label="Friends" value="1" />
          <Tab label="Invitations" value="2" />
          <Tab label="Player Search" value="3" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <Box display="flex" justifyContent="center" margin="0 auto">
          <FriendsList />
        </Box>
      </TabPanel>
      <TabPanel value="2">
        <Box display="flex" justifyContent="center" margin="0 auto">
          <FriendInvitationList />
        </Box>
      </TabPanel>
      <TabPanel value="3">
        <SearchPlayer />
      </TabPanel>
    </TabContext>
  );
};

export default Friends;
