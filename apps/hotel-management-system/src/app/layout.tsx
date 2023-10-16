import {Link, Outlet, useNavigate} from 'react-router-dom';
import * as React from 'react';
import {useEffect} from 'react';
import {CSSObject, styled, Theme, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import {Avatar, Paper, Stack} from '@mui/material';
import {useSelector} from 'react-redux';
import {RootState} from './redux/store';
import {useAppDispatch} from './redux/hooks';
import appStateSlice, {fetchUserDetails} from "./redux/slices/AppStateSlice";
import LogoutIcon from '@mui/icons-material/Logout';
import {logout, verifyLogin} from "./api/resources/auth";
import PeopleIcon from '@mui/icons-material/People';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import HailIcon from '@mui/icons-material/Hail';
import LoginIcon from '@mui/icons-material/Login';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListIcon from '@mui/icons-material/List';
import RoomServiceIcon from '@mui/icons-material/RoomService';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
    })
}));

const sidebarItems = [
    {
        text: 'Dashboard',
        icon: <DashboardIcon/>,
        to: '/',
    },
    {
        text: 'Room Management',
        isHeader: true,
    },
    {
        text: 'Rooms',
        icon: <MeetingRoomIcon/>,
        to: '/rooms',
    },
    {
        text: 'Tickets',
        icon: <ConfirmationNumberIcon/>,
        to: '/tickets',
    },
    {
        text: 'Scheduling',
        isHeader: true,
    },
    {
        text: 'Calendar',
        icon: <CalendarMonthIcon/>,
        to: '/calendar',
    },
    {
        text: 'Guest Management',
        isHeader: true,
    },
    {
        text: 'Guest Services', //feature for services
        icon: <RoomServiceIcon/>,
        to: '/guest-services',
    },
    {
        text: 'Guests',
        icon: <HailIcon/>,
        to: '/guests',
    },
    {
        text: 'Check In/Out',
        icon: <LoginIcon/>,
        to: '/check-in-out',
    },
    {
        text: 'Reservations',
        icon: <EventSeatIcon/>,
        to: '/reservations',
    },
    {
        text: 'Finance',
        isHeader: true,
    },
    {
        text: 'Transactions',
        icon: <ReceiptLongIcon/>,
        to: '/transactions',
    },
    {
        text: 'System',
        isHeader: true,
    },
    {
        text: 'Users',
        icon: <PeopleIcon/>,
        to: '/users',
    },
    {
        text: 'Roles',
        icon: <PermIdentityIcon/>,
        to: '/roles',
    },
    {
        text: 'Logs',
        icon: <ListIcon/>,
        to: '/logs',
    }
];

export function Layout() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUserDetails())
        verifyLogin(dispatch, navigate)
    }, []);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handlePageChange = (pageTitle: string, pageLink: string | undefined) => {
        if (pageLink !== undefined) {
            dispatch(appStateSlice.actions.setAppBarTitle(pageTitle))
            // set the window title
            document.title = pageTitle + ' - Hotel Management System'
        }
    }

    const handleLogoutButton = () => {
        const existingToken = localStorage.getItem('jwt');
        if (existingToken !== null) {
            logout()
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.removeItem('jwt');
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: 'Something went wrong',
                        severity: 'error'
                    }))
                })
        } else {
            window.location.reload();
        }
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'})
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                        {appState.appBarTitle}
                    </Typography>
                    <Paper sx={{padding: 1}}>
                        <Stack direction={"row"} alignItems={"center"} gap={1}>
                            <Avatar sx={{width: 30, height: 30}}>
                                {appState.currentlyLoggedInUser?.firstName?.charAt(0)}
                            </Avatar>
                            <>
                                {appState.currentlyLoggedInUser?.firstName} {appState.currentlyLoggedInUser?.lastName}
                            </>
                            <IconButton aria-label="delete" color="error" size={"small"} onClick={handleLogoutButton}>
                                <LogoutIcon/>
                            </IconButton>
                        </Stack>

                    </Paper>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon/>
                        ) : (
                            <ChevronLeftIcon/>
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {sidebarItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.isHeader ? (
                                <ListItem disablePadding sx={{display: open ? 'block' : 'none'}}>
                                    <Typography sx={{padding: 2}}>{item.text}</Typography>
                                </ListItem>
                            ) : (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        component={Link as any}
                                        to={item.to}
                                        onClick={() => handlePageChange(item.text, item.to)}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} sx={{opacity: open ? 1 : 0}}/>
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </React.Fragment>
                    ))}
                </List>
                <Divider/>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
                <Outlet/>
            </Box>
        </Box>
    );
}
