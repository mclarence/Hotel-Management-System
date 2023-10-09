import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useState} from 'react';
import {createNote, deleteNote, getNoteById, updateNote} from '../../api/calendar';
import {ApiResponse, CalendarNotes} from '@hotel-management-system/models';
import {useAppDispatch} from '../../redux/hooks';
import appStateSlice from '../../redux/slices/AppStateSlice';
import {Grid, Paper, SpeedDial, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export function Calendar() {
    const dispatch = useAppDispatch();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(new Date()));
    const [currentNote, setCurrentNote] = useState<CalendarNotes[]>([]);

    function fetchNote(date: Date) {
        getNoteById(date).then((response) => {
            return response.json();
        })
            .then((data: ApiResponse<CalendarNotes[]>) => {
                if (data.success) {
                    setCurrentNote(data.data);
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
            });
    }

    const handleButtonClick = () => {
        const text = prompt('Add a note');

        if (text != null && selectedDate != null) {
            const note: CalendarNotes = {
                note: text,
                date: selectedDate.toDate(),
            }

            createNote(note)
                .then((response) => {
                    return response.json();
                })
                .then((data: ApiResponse<null>) => {
                    if (data.success) {
                        fetchNote(selectedDate.toDate())
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: "Note added successfully.",
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
                .finally(() => {
                });

        }
    }

    const handleDeleteNote = (noteId: number) => {
        deleteNote(noteId)
            .then((response) => response.json())
            .then((data: ApiResponse<null>) => {
                if (data.success) {
                    fetchNote(selectedDate!.toDate())
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "Note deleted successfully.",
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
            .finally(() => {
            });
    }

    const handleEditNote = (noteObj: CalendarNotes) => {
        const text = prompt('Update a note', noteObj.note);

        if (text != null) {
            const updatedNote: CalendarNotes = {
                note: text,
                noteId: noteObj.noteId,
                date: noteObj.date,
            }

            updateNote(updatedNote)
                .then((response) => response.json())
                .then((data: ApiResponse<CalendarNotes>) => {
                    if (data.success) {
                        fetchNote(selectedDate!.toDate())
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: "Note updated successfully.",
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
                .finally(() => {
                });

        }
    }

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Calendar'));
        dispatch(appStateSlice.actions.setLastPageVisited('/calendar'));
    }, []);

    useEffect(() => {
        if (selectedDate != null) {
            fetchNote(selectedDate.toDate());
        }
    }, [selectedDate])

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper>
                        <DateCalendar value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)}/>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{padding: 2}}>
                        <Stack gap={2}>
                            <Typography variant={"h3"}>{selectedDate?.format("DD/MM/YYYY")}</Typography>
                            <Divider/>
                            {currentNote.length > 0 ? currentNote.map((note, index) => (
                                <Stack key={index} direction={"row"} gap={1} alignItems={"center"}>
                                    <Typography>{note.note}</Typography>
                                    <IconButton onClick={() => handleDeleteNote(note.noteId!)}>
                                        <DeleteIcon fontSize={"small"}/>
                                    </IconButton>
                                    <IconButton onClick={() => handleEditNote(note)}>
                                        <EditIcon fontSize={"small"}/>
                                    </IconButton>
                                </Stack>
                            )) : <Typography>No notes</Typography>}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: "fixed", bottom: 16, right: 16}}
                onClick={() => {
                    handleButtonClick()
                }}
                icon={<AddIcon/>}
            ></SpeedDial>
        </>
    )
}
