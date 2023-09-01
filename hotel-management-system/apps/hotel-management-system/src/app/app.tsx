import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LoginPage } from './pages/login-page/LoginPage';
import { Dashboard } from './pages/dashboard/Dashboard';
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
