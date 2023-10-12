import {IconButton, List, ListItem, Paper, Stack, TextField, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";

interface PermissionEditorProps {
    permissions: string[];
    setPermissions: (permissions: string[]) => void;
}

export const PermissionEditor = ({permissions, setPermissions}: PermissionEditorProps) => {

    const [addPermissionTextfieldValue, setAddPermissionTextfieldValue] =
        useState("");

    const handleAddPermission = () => {
        if (addPermissionTextfieldValue.length > 0) {
            // check if permission already exists
            if (permissions.includes(addPermissionTextfieldValue)) {
                alert("Permission already exists");
                setAddPermissionTextfieldValue("");
                return;
            }

            setPermissions([...permissions, addPermissionTextfieldValue]);
            setAddPermissionTextfieldValue("");
        }
    };

    const handleDeletePermission = (permission: string) => {
        setPermissions(permissions.filter((p) => p !== permission));
    };

    return (
        <>
            <Paper sx={{padding: 1}}>
                <Stack direction={"row"} gap={1}>
                    <TextField
                        size="small"
                        label="Enter Permission"
                        onChange={(e) => setAddPermissionTextfieldValue(e.target.value)}
                        value={addPermissionTextfieldValue}
                    />
                    <IconButton
                        disabled={addPermissionTextfieldValue.length === 0}
                        onClick={handleAddPermission}
                    >
                        <AddIcon/>
                    </IconButton>
                </Stack>
            </Paper>

            <Paper sx={{overflowY: "scroll", maxHeight: "200px"}}>
                {permissions.length === 0 ? (
                    <Typography variant="body1" sx={{padding: 2}}>
                        No permissions selected
                    </Typography>
                ) : (
                    <List>
                        {permissions.map((permission) => (
                            <ListItem
                                key={permission}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {permission}
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeletePermission(permission)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </>
    )
}