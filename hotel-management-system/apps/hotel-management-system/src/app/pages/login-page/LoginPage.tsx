import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
  makeStyles
} from '@mui/material';
import Card from '@mui/material/Card';
import { useState } from 'react';

export const LoginPage = () => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAlert(false);
    setIsLoading(true);
    // simulate a delay
    await delay(2000);
    setIsLoading(false);
    setShowAlert(true);
  };

  return (
    <Grid
      container
      spacing={20}
      columns={16}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
      padding={20}
    >
      <Grid item xs={7}>
        <Typography variant="h2">Login</Typography>
        <Typography variant="h6">
          Please enter your username and password to login.
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Card variant="outlined" sx={{ padding: 5 }}>
          <form onSubmit={handleLoginSubmit}>
            <Stack spacing={3}>
              {showAlert && <Alert severity="error">Login Failed</Alert>}

              <TextField required label="Username" onChange={(e) => setUsername(e.target.value)} />
              <TextField required label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              <Button
                variant="contained"
                type="submit"
                disabled={(username === '' || password === '') || isLoading}
                onClick={() => setShowAlert(true)}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    color='inherit'
                  />
                ) : (
                  <>
                    Login
                  </>
                )}
                
              </Button>
            </Stack>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
