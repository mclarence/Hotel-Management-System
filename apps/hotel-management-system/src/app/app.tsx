import {Alert, createTheme, CssBaseline, Snackbar, ThemeProvider} from '@mui/material';
import {LoginPage} from './pages/login-page/LoginPage';
import {Dashboard} from './pages/dashboard/Dashboard';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RoomsPage} from './pages/rooms-page/RoomsPage';
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
import ReservationsPage from './pages/reservations-page/ReservationsPage';
import {TransactionsPage} from "./pages/transactions/TransactionsPage";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Dashboard/>}/>
                            <Route path="rooms" element={<RoomsPage/>}/>
                            <Route path="tickets" element={<Tickets/>}/>
                            <Route path="calendar" element={<Calendar/>}/>
                            <Route path="users" element={<UsersPage/>}/>
                            <Route path="roles" element={<RolesPage/>}/>
                            <Route path="guests" element={<GuestsPage/>}/>
                            <Route path="check-in-out" element={<CheckInOutPage/>}/>
                            <Route path="reservations" element={<ReservationsPage/>}/>
                            <Route path="transactions" element={<TransactionsPage/>}/>
                        </Route>
                        <Route path="login" element={<LoginPage/>}/>
                    </Routes>
                </BrowserRouter>
                <Snackbar open={appState.snackBarAlert.show} autoHideDuration={6000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} onClose={handleSnackBarClose}>
                    <Alert onClose={handleSnackBarClose} severity={appState.snackBarAlert.severity} sx={{width: '100%'}}
                           variant={"filled"}>
                        {appState.snackBarAlert.message}
                    </Alert>
                </Snackbar>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

const AppBlock = block(App);

export default AppBlock;
