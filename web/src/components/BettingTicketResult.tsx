import Box from '@mui/material/Box';
import Card from "@mui/material/Card"
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from "@mui/material/Grid";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type TicketPropertyFromCode = { // 解読APIから得られるデータ型
    Race: {
        Track: string,
        Year: string,
        Turn: number,
        Day: number,
        Number: number
    },
    Bet: {
        Type: string,
        Style: string,
        Price: number,
        BetCombination: number[][]
    }[]
}

// ひとつのレースの馬券の表示
export default function BettingTicketResult(props: {ticketObject: TicketPropertyFromCode}): JSX.Element {
    const ticket = props.ticketObject
    const {Track, Year, Turn, Day, Number } = ticket.Race
    const track = <Typography variant="h5" noWrap>{Track}</Typography>
    const year = <Typography variant="h6" noWrap><Box component="span">{Year}</Box>年</Typography>
    const turn = <Typography variant="h6" noWrap><Box component="span">{Turn}</Box>回</Typography>
    const day = <Typography variant="h6" noWrap><Box component="span">{Day}</Box>日</Typography>
    const raceNum = <Typography variant="h5" noWrap><Box component="span">{Number}</Box>レース</Typography>

    const raceText = <Grid spacing={2} container justifyContent="center" alignItems="flex-end">
        <Stack component={Grid} item spacing={1} direction="row">
            {year}{turn}{day}
        </Stack>
        <Stack component={Grid} item spacing={1} direction="row">
            {track}{raceNum}
        </Stack>
    </Grid>

    const betContentItems = ticket.Bet.map((bet, betIndex) => { // 展開された馬券ごと
        const {Type, Style, Price, BetCombination } = bet
        const type = <Typography variant="h5" noWrap fontWeight="bold">{Type}</Typography>
        const betStyle = <Typography noWrap>{Style}</Typography>
        const price = <Typography variant="h6" noWrap><Box component="span" fontWeight="medium">{Price}</Box>円</Typography>

        const betCardHeader = <Stack spacing={1} direction="row" justifyContent="space-between" flexWrap="wrap">{type}{price}</Stack>

        const combinationItems = BetCombination.filter(value => value).map((value, orderIndex) => { // 1~3頭目の組ごと
            const label = <Typography variant="subtitle1" noWrap>{orderIndex + 1}頭目</Typography>
            const numbers = value.map((num, numIndex) => { // 選択された馬番ごと
                return <Box
                            key={numIndex}
                            width={24} height={24}
                            fontWeight="medium" fontSize={20}
                            textAlign="center"
                            border={1}
                            borderColor="common.black"
                            mx={1}
                            mb={1}
                        >
                            {num}
                        </Box>
            })

            return <ListItem key={orderIndex} dense>
                <Grid container spacing={1}>
                    <Grid item xs="auto">
                        {label}
                    </Grid>
                    <Grid item xs display="flex" direction="row" flexWrap="wrap">
                        {numbers}
                    </Grid>
                </Grid>
            </ListItem>
        })

        return <ListItem key={betIndex} disableGutters>
            <Card raised sx={{width: "100%"}}>
                <CardHeader disableTypography title={betCardHeader} />
                <CardContent sx={{pt: 1, borderTop: 2, borderColor: "secondary.main"}}>
                    <List disablePadding subheader={<ListSubheader disableGutters>{betStyle}</ListSubheader>}>
                        {combinationItems}
                    </List>
                </CardContent>
            </Card>
        </ListItem>
    })

    return <Card>
        <CardHeader
            sx={{bgcolor: "secondary.light"}}
            title={raceText}
            disableTypography
        />
        <CardContent>
            <List disablePadding>
                {betContentItems}
            </List>
        </CardContent>
    </Card>
}