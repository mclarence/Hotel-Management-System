import {Alert, Button, CircularProgress, Grid, Stack, TextField, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import {useEffect, useState} from 'react';
import {login} from "../../api/resources/auth";
import {ApiResponse} from "@hotel-management-system/models";
import {useAppDispatch} from "../../redux/hooks";
import {useNavigate} from "react-router-dom";
import appStateSlice, {fetchUserDetails} from "../../redux/slices/AppStateSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

export const LoginPage = () => {
    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
    const [showAlert, setShowAlert] = useState({
        show: false,
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const appState = useSelector((state: RootState) => state.appState);

    useEffect(() => {
        console.log("checking login status");
        if (appState.loggedIn) {
            if (appState.lastPageVisited !== '') {
                console.log("redirecting to last page visited");
                navigate(appState.lastPageVisited);
            } else {
                console.log("redirecting to home page");
                navigate('/');
            }
        } else {
            console.log("not logged in");
            if (localStorage.getItem("jwt") !== null) {
                console.log("jwt exists");
                dispatch(fetchUserDetails());
                dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: 'Welcome back!',
                        severity: 'success'
                }))
            }
        }
    }, [appState.loggedIn]);
    const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowAlert({
            show: false,
            message: ''
        });
        setIsLoading(true);

        login(username, password)
            .then((response) => {
                return response.json();
            })
            .then((response: ApiResponse<{ jwt: string } | null>) => {
                if (response.data !== null) {
                    localStorage.setItem('jwt', response.data.jwt);
                    dispatch(fetchUserDetails());
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: 'Login successful',
                        severity: 'success'
                    }))
                } else {
                    throw new Error(response.message)
                }
            })
            .catch((error) => {
                setShowAlert({
                    show: true,
                    message: error.message
                });
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return (
        <Grid
            container
            spacing={20}
            columns={16}
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{minHeight: '100vh'}}
            padding={20}
        >
            <Grid item xs={7}>
                <Typography variant="h2">Login</Typography>
                <Typography variant="h6">
                    Please enter your username and password to login.
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Card variant="outlined" sx={{padding: 5}}>
                    <form onSubmit={handleLoginSubmit}>
                        <Stack spacing={3}>
                            {showAlert.show && <Alert severity="error">{showAlert.message}</Alert>}

                            <TextField required label="Username" onChange={(e) => setUsername(e.target.value)}/>
                            <TextField required label="Password" type="password"
                                       onChange={(e) => setPassword(e.target.value)}/>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={(username === '' || password === '') || isLoading}
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
