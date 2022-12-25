import { useMemo, useState } from 'react';
import { axiosInstance, isAxiosError } from '../providors/axios';

import QRCodeReader from './QRCodeReader';
import BettingTicketResult, { TicketPropertyFromCode } from './BettingTicketResult'

export default function TicketQRReader(): JSX.Element {
    const numberOfCode = 2 // 読み取るQRコード数

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
                <p>{errorMessage}</p>
                <button onClick={() =>  resetQRReader()}>最初の画面に戻る</button>
            </>)
        } else if (ticketObject === null) { // APIからデータが来るまでロード画面
            return(<p>Now Loading...</p>)
        } else {
            return(<>
                <p>読み取りが完了しました。</p>
                <BettingTicketResult ticketObject={ticketObject} />
                <button onClick={() =>  resetQRReader()}>他の馬券を読み取る</button>
            </>)
        }
    }, [errorMessage, ticketObject])

    return <div>
        {!isCompleted
            ? <QRCodeReader
                numberOfReadCode={numberOfCode}
                onCompleteRead={onCompleteRead}
            />
            : <>{completeElement}</>
        }
    </div>
}
