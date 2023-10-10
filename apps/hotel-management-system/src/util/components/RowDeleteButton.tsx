import {GridCellParams} from "@mui/x-data-grid";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import {CircularProgress} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const RowDeleteButton = (props: {
    params: GridCellParams,
    deleteFunction: (id: number) => void,
    idField: string
}) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await props.deleteFunction(props.params.row[props.idField]);
        setIsDeleting(false);
    }

    return (
        <IconButton size={"small"} color={"error"} onClick={handleDelete}
                    disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20}/> : <DeleteIcon fontSize={"inherit"}/>}
        </IconButton>
    )

}