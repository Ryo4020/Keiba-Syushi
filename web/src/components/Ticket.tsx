import { useMemo, useState } from 'react';

import { axiosInstance, isAxiosError } from '../providors/axios';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TicketQRReader from './TicketQRReader';
import BettingTicketResult, { TicketPropertyFromCode } from './BettingTicketResult'

export default function Ticket(): JSX.Element {
    const [isCompleted, setIsCompleted] = useState<boolean>(false) // 全てのQRコードが読み取られたか
    const [ticketObject, setTicketObject] = useState<TicketPropertyFromCode | null>(null) // APIから返ってきた馬券情報

    const [errorMessage, setErrorMessage] = useState<string>("") // エラー時の表示メッセージ

    // 2つのQRコードが読まれたとき
    function onCompleteRead(results: string[]) {
        setIsCompleted(true)
        const text = results.join("")
        handleReadText(text)
    }

    // 数字列の解読結果をAPIから取得
    async function handleReadText(text: string) {
        if (text === "") {
            return
        }

        const params = new URLSearchParams({
            code: text
        })

        try {
            const response = await axiosInstance.get(`reader?${params}`)
            setTicketObject(response.data)
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                console.error(err)
                setErrorMessage("読み込んだQRコードが正しくありません。再度読み込みを行なってください。")
            } else {
                setErrorMessage("サーバーとの通信に失敗しました。再度読み込みを行なってください。")
            }
        }
    }

    // 読み取り状態の初期化
    function resetQRReader() {
        setIsCompleted(false)
        setTicketObject(null)
        setErrorMessage("")
    }

    // QRコード読み取り完了後の表示
    const completeElement = useMemo(() => {
        if (errorMessage !== "") { // エラー発生時はメッセージ表示
            return(<>
                <Alert severity="error">{errorMessage}</Alert>
                <Box width="100%" textAlign="center" mt={2}>
                    <Button variant="outlined" onClick={() => resetQRReader()}>最初の画面に戻る</Button>
                </Box>
            </>)
        } else if (ticketObject === null) { // APIからデータが来るまでロード画面
            return(<Stack width="100%" display="flex" justifyContent="center" direction="row" flexWrap="wrap" spacing={4}>
                    <CircularProgress color="info" />
                    <Typography variant="h6">Now Loading...</Typography>
                </Stack>
            )
        } else {
            return(<Stack width="100%" spacing={2}>
                <Alert severity="success">読み取りが完了しました</Alert>
                <BettingTicketResult ticketObject={ticketObject} />
                <Box width="100%" textAlign="center" mt={2}>
                    <Button variant="outlined" onClick={() => resetQRReader()}>最初の画面に戻る</Button>
                </Box>
            </Stack>)
        }
    }, [errorMessage, ticketObject])

    return <Container maxWidth="sm" sx={{my: 6}}>
        {!isCompleted
            ? <TicketQRReader
                onCompleteRead={onCompleteRead}
            />
            : <>{completeElement}</>
        }
    </Container>
}
