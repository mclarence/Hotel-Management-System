import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useState} from 'react';
import {createNote, deleteNote, getNoteById, updateNote} from '../../api/resources/calendar';
import {ApiResponse, CalendarNotes} from '@hotel-management-system/models';
import {useAppDispatch} from '../../redux/hooks';
import appStateSlice from '../../redux/slices/AppStateSlice';
import {Grid, Paper, SpeedDial, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {makeApiRequest} from "../../api/makeApiRequest";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

export function Calendar() {
    const dispatch = useAppDispatch();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs.utc());
    const [currentNote, setCurrentNote] = useState<CalendarNotes[]>([]);
    const appState = useSelector((state: RootState) => state.appState);

    // fetch a note by date
    function fetchNote(date: Date) {
        makeApiRequest<CalendarNotes[]>(
            getNoteById(date),
            dispatch,
            (data) => {
                setCurrentNote(data);
            }
        )
    }

    // add note to date button handler.
    const handleButtonClick = () => {
        const text = prompt('Add a note');

        if (text != null && selectedDate != null) {
            const note: CalendarNotes = {
                note: text,
                date: selectedDate.toDate(),
            }

            makeApiRequest<null>(
                createNote(note),
                dispatch,
                (data) => {
                    fetchNote(selectedDate!.toDate())
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "Note added successfully.",
                            severity: "success",
                        })
                    );
                }
            )
        }
    }

    // delete note button handler.
    const handleDeleteNote = (noteId: number) => {
        makeApiRequest<null>(
            deleteNote(noteId),
            dispatch,
            (data) => {
                fetchNote(selectedDate!.toDate())
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Note deleted successfully.",
                        severity: "success",
                    })
                );
            }
        )

    }

    // edit note button handler.
    const handleEditNote = (noteObj: CalendarNotes) => {
        const text = prompt('Update a note', noteObj.note);

        if (text != null) {
            const updatedNote: CalendarNotes = {
                note: text,
                noteId: noteObj.noteId,
                date: noteObj.date,
            }

            makeApiRequest<CalendarNotes>(
                updateNote(updatedNote),
                dispatch,
                (data) => {
                    fetchNote(selectedDate!.toDate())
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "Note updated successfully.",
                            severity: "success",
                        })
                    );
                }
            )
        }
    }

    // fetch note on date change.
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
                        <DateCalendar value={selectedDate} onChange={setSelectedDate} timezone={appState.timeZone}/>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{padding: 2}}>
                        <Stack gap={2}>
                            <Typography component={'span'} variant={"h3"}>{selectedDate?.format("DD/MM/YYYY")}</Typography>
                            <Divider/>
                            {currentNote.length > 0 ? currentNote.map((note, index) => (
                                <Stack key={index} direction={"row"} gap={1} alignItems={"center"}>
                                    <Typography component={'span'}>{note.note}</Typography>
                                    <IconButton onClick={() => handleDeleteNote(note.noteId!)}>
                                        <DeleteIcon fontSize={"small"}/>
                                    </IconButton>
                                    <IconButton onClick={() => handleEditNote(note)}>
                                        <EditIcon fontSize={"small"}/>
                                    </IconButton>
                                </Stack>
                            )) : <Typography component={'span'}>No notes</Typography>}
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
