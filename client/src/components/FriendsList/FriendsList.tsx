import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

type Props = {};

const FriendsList = (props: Props) => {
  const friends = [
    {
      name: 'John Doe',
      ratings: { rapid: 1200, blitz: 1100, bullet: 1000, classical: 1300 },
    },
    {
      name: 'Jane Smithaaaaaaaa',
      ratings: { rapid: 1250, blitz: 1150, bullet: 1050, classical: 1350 },
    },
    // Add more friends here
  ];

  return (
    <Paper
      elevation={10}
      sx={{
        borderColor: 'primary.main',
        borderRadius: '10px',
        width: '50%',
        maxWidth: '400px',
        minHeight: '400px',
      }}
    >
      <Box
        bgcolor={'primary.main'}
        color={'primary.contrastText'}
        padding={'10px 0'}
        sx={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h5" fontWeight={'bold'} textAlign={'center'}>
          Friends
        </Typography>
      </Box>
      <List>
        {friends.map((friend, index) => (
          <div key={index}>
            <ListItem
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'10px'}
                width={'100%'}
              >
                <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={'100px'}
                >
                  <ListItemIcon sx={{ justifyContent: 'center' }}>
                    <PersonIcon
                      sx={{
                        width: '40px',
                        height: '40px',
                        p: '5px',
                        borderRadius: '50%',
                      }}
                    />
                  </ListItemIcon>
                  <Typography
                    lineHeight={1}
                    variant={'body1'}
                    textAlign={'center'}
                  >
                    {friend.name}
                  </Typography>
                </Stack>

                <Stack>
                  <Typography variant="caption">
                    Rapid: {friend.ratings.rapid}
                  </Typography>
                  <Typography variant="caption">
                    Blitz: {friend.ratings.blitz}
                  </Typography>
                  <Typography variant="caption">
                    Bullet: {friend.ratings.bullet}
                  </Typography>
                  {/* <Typography variant="caption">
                    Classical: {friend.ratings.classical}
                  </Typography> */}
                </Stack>

                <Divider orientation="vertical" flexItem />

                <Button size="small" variant="contained" color="secondary">
                  Invite
                </Button>
              </Stack>
            </ListItem>
            {<Divider sx={{ mx: '10px' }} />}
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default FriendsList;
