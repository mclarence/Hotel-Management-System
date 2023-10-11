import {Button, Dialog, DialogContent, Stack, TextField} from "@mui/material";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {ApiResponse, Ticket, TicketStatuses, User} from "@hotel-management-system/models";
import {useEffect, useState} from "react";
import {addTicket} from "../../../api/resources/tickets";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {UserAutoCompleteBox} from "../../../../util/components/UserAutoCompleteBox";
import {TicketStatusAutoCompleteBox} from "./TicketStatusAutoCompleteComboBox";
import {useAppDispatch} from "../../../redux/hooks";
import {makeApiRequest} from "../../../api/makeApiRequest";

interface CreateTicketDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchTickets: () => void;
}

export const CreateTicketDialog = (props: CreateTicketDialogProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<TicketStatuses>(TicketStatuses.OPEN);
    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const resetState = () => {
        setUser(null);
        setTitle("");
        setDescription("");
        setStatus(TicketStatuses.OPEN);
    }
    useEffect(() => {
        setSaveButtonDisabled(
            user === null ||
            title === "" ||
            description === ""
        )
    }, [user, title, description, status])

    const handleSubmit = () => {
        if (user !== null && title !== "" && description !== "" && status) {
            makeApiRequest<Ticket>(
                addTicket({
                    title: title,
                    description: description,
                    status: status,
                    userId: user?.userId!,
                    dateOpened: new Date()
                }),
                dispatch,
                (data) => {
                    props.setOpen(false);
                    resetState();
                    props.fetchTickets();
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "Ticket created",
                            severity: "success",
                        })
                    );
                }
            )
        }
    }

    return (
        <Dialog open={props.open}>
            <DialogHeader title={"Create Ticket"} onClose={() => props.setOpen(false)}/>
            <DialogContent>
                <Stack direction={"column"} spacing={2}>
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
                    <TicketStatusAutoCompleteBox currentValue={status} setValue={setStatus}/>
                    <Button variant={"contained"} disabled={saveButtonDisabled} onClick={handleSubmit}>
                        Create Ticket
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}