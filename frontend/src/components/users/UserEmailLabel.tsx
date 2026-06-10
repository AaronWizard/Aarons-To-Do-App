import { Typography } from "@mui/material";

import { useAuth } from "../auth/useAuth"

export default function UserEmailLabel() {
    const { currentUserEmail } = useAuth();

    return (
        <Typography>
            Logged in as {currentUserEmail()}
        </Typography>
    )
}
