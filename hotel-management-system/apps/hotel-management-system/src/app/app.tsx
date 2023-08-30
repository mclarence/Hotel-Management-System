import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LoginPage } from './pages/login-page/LoginPage';

const darkTheme = createTheme({
  palette: {
    mode: 'light'
  }
});

export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <LoginPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
