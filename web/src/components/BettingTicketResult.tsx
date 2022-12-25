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
    const track = <div>{Track}</div>
    const year = <div><span>{Year}</span>年</div>
    const turn = <div><span>{Turn}</span>回</div>
    const day = <div><span>{Day}</span>日</div>
    const raceNum = <div><span>{Number}</span>レース</div>

    const betContents = ticket.Bet.map((bet, betIndex) => { // 展開された馬券ごと
        const {Type, Style, Price, BetCombination } = bet
        const type = <div>{Type}</div>
        const betStyle = <div>{Style}</div>
        const price = <div>各<span>{Price}</span>円</div>
        const combinations = BetCombination.filter(value => value).map((value, orderIndex) => { // 1~3頭目の組ごと
            const label = <p>{orderIndex + 1}頭目</p>
            const numbers = value.map((num, numIndex) => { // 選択された馬番ごと
                return <span key={numIndex} style={{border: "1px black solid", margin: "0 8px"}}>{num}</span>
            })

            return <div key={orderIndex} style={{display: "flex", justifyContent: "center"}}>{label}{numbers}</div>
        })

        return <div key={betIndex}><div style={{display: "flex", justifyContent: "center"}}>{type}{betStyle}{price}</div>{combinations}</div>
    })

    return <div style={{ margin: "0 auto", padding: "12px", border: "1px dashed silver"}}>
        <header style={{display: "flex", justifyContent: "center"}}>
            {year}
            {turn}
            {day}
            {track}
            {raceNum}
        </header>
        <main style={{margin: "18px"}}>{betContents}</main>
    </div>
}