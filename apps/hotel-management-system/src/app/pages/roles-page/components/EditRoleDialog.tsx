import {
    Button,
    Dialog,
    DialogContent,
    IconButton,
    List,
    ListItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {addRole, updateRole} from "../../../api/resources/roles";
import {Role} from "@hotel-management-system/models";
import {useAppDispatch} from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {makeApiRequest} from "../../../api/makeApiRequest";
import EditIcon from "@mui/icons-material/Edit";
import {PermissionEditor} from "./PermissionEditor";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

interface IAddRoleDialogProps {
    role: Role | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshRoles: () => void;
}

export const EditRoleDialog = (props: IAddRoleDialogProps) => {
    const [hasChangedSomething, setHasChangedSomething] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([] as string[]);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.role != null) {
            setRoleName(props.role.name);
            setPermissions(props.role.permissionData);
        }
    }, [props.open, props.role]);

    useEffect(() => {
        if (roleName.length > 0 && permissions.length > 0) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }, [permissions, roleName]);

    const resetState = () => {
        setRoleName("");
        setPermissions([]);
        setSaveButtonDisabled(true);
        setHasChangedSomething(false);
        setIsSubmitting(false);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const newRole: Role = {
            roleId: props.role?.roleId || 0,
            name: roleName,
            permissionData: permissions,
        };

        makeApiRequest<Role>(
            updateRole(newRole),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshRoles();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Role updated successfully",
                        severity: "success",
                    })
                );
            },
            () => {
                setIsSubmitting(false);
            }
        )
    };

    const handleClose = () => {
        // ask user if they want to discard changes
        if (hasChangedSomething) {
            if (window.confirm("Are you sure you want to discard changes?")) {
                resetState();
                props.setOpen(false);
            }
        } else {
            resetState();
            props.setOpen(false);
        }
    };

    return (
        <Dialog open={props.open}>
            <DialogHeader title={`Editing Role: ${props.role?.name}`} onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant={"body1"}>
                        Set role name and permissions below.
                    </Typography>
                    <TextField
                        fullWidth
                        required
                        label="Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                    <PermissionEditor permissions={permissions} setPermissions={setPermissions}/>

                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<EditIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Updating role..." : "Edit Role"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
