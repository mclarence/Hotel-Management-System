import {Alert, createTheme, CssBaseline, Snackbar, ThemeProvider} from '@mui/material';
import {LoginPage} from './pages/login-page/LoginPage';
import {Dashboard} from './pages/dashboard/Dashboard';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Rooms} from './pages/rooms/Rooms';
import {Layout} from './layout';
import {Tickets} from './pages/tickets/Tickets';
import {Calendar} from './pages/calendar/Calendar';
import {useSelector} from "react-redux";
import {RootState} from "./redux/store";
import appStateSlice from "./redux/slices/AppStateSlice";
import {useAppDispatch} from "./redux/hooks";
import {UsersPage} from "./pages/users-page/UsersPage";
import {RolesPage} from "./pages/roles-page/RolesPage";
import {block} from "million/react";
import GuestsPage from './pages/guests-page/GuestsPage';
import CheckInOutPage from './pages/checkin-out-page/CheckInOutPage';

export const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

export function App() {

    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const handleSnackBarClose = () => {
        dispatch(appStateSlice.actions.setSnackBarAlert({
            ...appState.snackBarAlert,
            show: false,
        }))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Dashboard/>}/>
                        <Route path="rooms" element={<Rooms/>}/>
                        <Route path="tickets" element={<Tickets/>}/>
                        <Route path="calendar" element={<Calendar/>}/>
                        <Route path="users" element={<UsersPage/>}/>
                        <Route path="roles" element={<RolesPage/>}/>
                        <Route path="guests" element={<GuestsPage/>}/>
                        <Route path="check-in-out" element={<CheckInOutPage/>}/>
                    </Route>
                    <Route path="login" element={<LoginPage/>}/>
                </Routes>
            </BrowserRouter>
            <Snackbar open={appState.snackBarAlert.show} autoHideDuration={6000} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity={appState.snackBarAlert.severity} sx={{width: '100%'}} variant={"filled"}>
                    {appState.snackBarAlert.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

const AppBlock = block(App);

export default AppBlock;
