import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LoginPage } from './pages/login-page/LoginPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Rooms } from './pages/rooms/Rooms';
import { Layout } from './layout';
import { Tickets } from './pages/tickets/Tickets';
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
