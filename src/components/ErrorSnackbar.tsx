import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import WarningIcon from '@mui/icons-material/Warning';

type ErrorSnackbarProps = {
    error: string;
    onClose: () => void;
};

export default function ErrorSnackbar({ error, onClose }: ErrorSnackbarProps) {
    return (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity="error" icon={<WarningIcon />}>
                {error}
            </Alert>
        </Snackbar>
    );
}
