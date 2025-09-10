import {useNavigate} from "react-router";
import {IconButton} from "@mui/material";
import {IconEdit} from "@tabler/icons-react";

export const RenderEditButton = (editHref: string) => {
    const navigate = useNavigate()

    return (
        <IconButton
            color={"primary"}
            onClick={() => navigate(editHref)}>
            <IconEdit/>
        </IconButton>
    )
}

export interface FormFieldProps<T> {
    value: T;
    isValid?: boolean;
    onChange: (value: T) => void;
}
