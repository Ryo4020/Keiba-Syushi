import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';

export default function GlobalHeader(): JSX.Element {
    return <AppBar position="static" color="primary">
        <Typography variant="h4" component="h1" align='center' sx={{margin: "8px 0"}}>
            QRコードリーダー
        </Typography>
    </AppBar>
}