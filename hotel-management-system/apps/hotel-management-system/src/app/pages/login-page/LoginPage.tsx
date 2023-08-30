import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  makeStyles
} from '@mui/material';
import Card from '@mui/material/Card';

export const LoginPage = () => {
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
          <form>
            <Stack spacing={3}>
              <TextField required label="Username" />
              <TextField required label="Password" type="password" />
              <Button variant="contained" type="submit">
                Login
              </Button>
            </Stack>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
