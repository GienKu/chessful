import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { FormEvent, use, useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type Props = {};

const CreateGame = (props: Props) => {
  const [minutes, setMinutes] = useState(10);
  const [increment, setIncrement] = useState(5);
  const [color, setColor] = useState<'w' | 'b'>('w');
  const [ranked, setRanked] = useState(false);
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { socket } = useSocket();

  const handleCreateGame = (e: FormEvent) => {
    e.preventDefault();
    const tempo = `${minutes}+${increment}`;
    console.log('clicked')
    socket?.emit(
      'createGame',
      { tempo, color: color, ranked },
      (gameId: string) => {
        navigate(`/game/${gameId}`);
      }
    );
  };

  useEffect(() => {
    setRanked(false);
  }, [authState.user]);

  return (
    <Paper
      elevation={10}
      sx={{
        p: '15px',
        maxWidth: '320px',
        width: '50%',
        border: '1px solid',
        borderTopColor: 'secondary.dark',
        borderLeftColor: 'secondary.dark',
        borderRightColor: 'primary.dark',
        borderBottomColor: 'primary.dark',
      }}
    >
      <form onSubmit={handleCreateGame}>
        <Stack gap={'5px'}>
          <Typography
            color="text.primary"
            component={'h4'}
            fontSize={'26px'}
            textAlign={'center'}
            gutterBottom
          >
            Create game
            <Divider sx={{ mt: '5px' }}></Divider>
          </Typography>
          <Box mb={2} display="flex" flexDirection="column" alignItems="center">
            <Typography color="text.primary" gutterBottom>
              Time (minutes):
            </Typography>
            <Slider
              sx={{ maxWidth: 250 }}
              color="secondary"
              value={minutes}
              onChange={(e, newValue) => setMinutes(newValue as number)}
              step={1}
              min={1}
              max={60}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mb={2} display="flex" flexDirection="column" alignItems="center">
            <Typography color="text.primary" gutterBottom>
              Added Time After Move (seconds):
            </Typography>
            <Slider
              sx={{ maxWidth: 250 }}
              color="secondary"
              value={increment}
              onChange={(e, newValue) => setIncrement(newValue as number)}
              step={1}
              min={0}
              max={60}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>Preferred Pieces Color</InputLabel>
              <Select
                value={color}
                onChange={(e) => setColor(e.target.value as 'w' | 'b')}
              >
                <MenuItem value="w">White</MenuItem>
                <MenuItem value="b">Black</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {authState.user && (
            <Stack
              mb={2}
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ranked}
                    onChange={(e) => setRanked(e.target.checked)}
                  />
                }
                label="Ranked Game"
              />
            </Stack>
          )}
          <Button
            sx={{ width: 'max-content', m: '0 auto' }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Let's play
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateGame;
