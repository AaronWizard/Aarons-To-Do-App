import { Button } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import { useMutation } from "@tanstack/react-query";

export default function Logout() {
    const { logout } = useAuth();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            return logout();
        }
    });

    function handleLogout(): void {
        logoutMutation.mutate();
    }

    return (
        <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
        >
            {logoutMutation.isPending ? 'Logging Out' : 'Logout'}
        </Button>
    );
}
