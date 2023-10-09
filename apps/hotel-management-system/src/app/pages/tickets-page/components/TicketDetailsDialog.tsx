import {Button, Dialog, DialogContent, Grid, Paper, SpeedDial, Stack, TextField} from "@mui/material";
import {ApiResponse, Ticket, TicketMessages, TicketStatuses, User} from "@hotel-management-system/models";
import {DialogHeader} from "../../../../util/DialogHeader";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {UserAutoCompleteBox} from "../../../../util/UserAutoCompleteBox";
import React, {useEffect, useState} from "react";
import {getUserById} from "../../../api/users";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {TicketStatusAutoCompleteBox} from "./TicketStatusAutoCompleteComboBox";
import {addCommentToTicket, getTicketComments, updateTicket} from "../../../api/tickets";
import {useAppDispatch} from "../../../redux/hooks";
import AddIcon from "@mui/icons-material/Add";

export const TicketDetailsDialog = (props: {
    open: boolean
    setOpen: (open: boolean) => void
    ticket: Ticket | null
    fetchTickets: () => void
}) => {

    const [user, setUser] = useState<User | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<TicketStatuses>(TicketStatuses.OPEN);
    const dispatch = useAppDispatch();
    const [ticketComments, setTicketComments] = useState<TicketMessages[]>([]);

    const fetchTicketComments = () => {
        if (props.ticket !== null) {
            getTicketComments(props.ticket.ticketId!)
                .then((response) => {
                    return response.json();
                })
                .then((data: ApiResponse<TicketMessages[]>) => {
                    if (data.success) {
                        setTicketComments(data.data);
                    } else if (!data.success && data.statusCode === 401) {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "warning",
                            })
                        );
                    } else {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "error",
                            })
                        );
                    }
                })
                .catch(() => {
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "An unknown error occurred",
                            severity: "error",
                        })
                    );
                })
        }
    }

    const handleAddTicketComment = () => {
        if (props.ticket !== null) {
            const comment = prompt("Enter a comment");

            if (comment !== null && user !== null) {
                const ticketMessage: TicketMessages = {
                    ticketId: props.ticket.ticketId!,
                    userId: user.userId!,
                    message: comment,
                    dateCreated: new Date()
                }

                addCommentToTicket(ticketMessage)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data: ApiResponse<TicketMessages>) => {
                        if (data.success) {
                            fetchTicketComments();
                            dispatch(
                                appStateSlice.actions.setSnackBarAlert({
                                    show: true,
                                    message: "Comment added.",
                                    severity: "success",
                                })
                            );
                        } else if (!data.success && data.statusCode === 401) {
                            dispatch(
                                appStateSlice.actions.setSnackBarAlert({
                                    show: true,
                                    message: data.message,
                                    severity: "warning",
                                })
                            );
                        } else {
                            dispatch(
                                appStateSlice.actions.setSnackBarAlert({
                                    show: true,
                                    message: data.message,
                                    severity: "error",
                                })
                            );
                        }
                    })
                    .catch(() => {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: "An unknown error occurred",
                                severity: "error",
                            })
                        );
                    })
            }
        }
    }

    useEffect(() => {
        if (props.ticket !== null) {
            setTitle(props.ticket.title);
            setDescription(props.ticket.description);
            setStatus(props.ticket.status);
            fetchTicketComments();
        }
    }, [props.open, props.ticket])

    useEffect(() => {
        if (props.ticket !== null) {
            getUserById(props.ticket.userId)
                .then((response) => {
                    return response.json();
                })
                .then((data: ApiResponse<User>) => {
                    if (data.success) {
                        setUser(data.data);
                    } else if (!data.success && data.statusCode === 401) {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "warning",
                            })
                        );
                    } else {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "error",
                            })
                        );
                    }
                })
                .catch(() => {
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "An unknown error occurred",
                            severity: "error",
                        })
                    );
                })
        }
    }, [props.open, props.ticket]);

    const handleSaveButton = () => {
        if (props.ticket !== null && user !== null) {
            const updatedTicket: Ticket = {
                ticketId: props.ticket.ticketId,
                userId: user.userId!,
                title: title,
                description: description,
                status: status,
                dateOpened: props.ticket.dateOpened
            }

            updateTicket(updatedTicket)
                .then((response) => {
                    return response.json();
                })
                .then((data: ApiResponse<Ticket>) => {
                    if (data.success) {
                        props.setOpen(false);
                        props.fetchTickets();
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: "Ticket updated.",
                                severity: "success",
                            })
                        );
                    } else if (!data.success && data.statusCode === 401) {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "warning",
                            })
                        );
                    } else {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "error",
                            })
                        );
                    }
                })
                .catch(() => {
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "An unknown error occurred",
                            severity: "error",
                        })
                    );
                })
        }
    }

    return (
        <Dialog open={props.open} fullWidth fullScreen>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: 'fixed', bottom: 16, right: 16}}
                onClick={() => {
                    handleAddTicketComment();
                }}
                icon={
                    <AddIcon/>
                }
            >
            </SpeedDial>
            <DialogHeader title={`Viewing Ticket - ${props.ticket?.ticketId}`}
                          onClose={() => props.setOpen(false)}/>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Paper sx={{padding: 2}}>
                            <Stack direction={"column"} gap={2}>
                                <Typography variant={"h6"}>Ticket Details</Typography>
                                <Divider/>
                                <UserAutoCompleteBox value={setUser} currentValue={user}/>
                                <TextField
                                    fullWidth
                                    label={"Title"}
                                    variant={"outlined"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label={"Description"}
                                    variant={"outlined"}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <TicketStatusAutoCompleteBox currentValue={status!} setValue={setStatus}/>
                                <Button variant={"contained"} onClick={handleSaveButton}>Save</Button>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper sx={{padding: 2}}>
                            <Stack direction={"column"} gap={2}>
                                <Typography variant={"h6"}>Ticket Comments</Typography>
                                <Divider/>
                                {ticketComments.map((comment) => {

                                    const formattedTime = new Date(comment.dateCreated).toISOString()

                                    return (
                                        <Paper sx={{padding: 2}}>
                                            <Stack direction={"column"} gap={1}>
                                                <Typography variant={"body1"}>{comment.message}</Typography>
                                                <Typography
                                                    variant={"caption"}>{formattedTime}</Typography>
                                            </Stack>
                                        </Paper>
                                    )
                                })}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}