import React from "react";

import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser"

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton";
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from "@mui/material/Tooltip";
import Typography from '@mui/material/Typography';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type Props = {
  numberOfReadCode: number // 読み取るQRコード数
  onCompleteRead: (texts: string[]) => void // 読み取りが完了時に結果配列を処理する関数
}

// componentWillUnmountを使用するためクラスコンポーネント
class QRCodeReader extends React.Component<Props, {readResultList: string[], scannerControls: IScannerControls | null}, {cameraRef: HTMLVideoElement}> {
  constructor(props: Props) {
    super(props)
    this.state = {
      readResultList: [], // 読み取った結果の配列
      scannerControls: null // カメラの制御をするオブジェクト
    }
  }
  private cameraRef = React.createRef<HTMLVideoElement>() // カメラのHTMLElementのRef

  // カメラを起動する
  setupCamera() {
    if (!this.cameraRef.current) { // カメラDOMのRefがないエラー
      console.error('Not found QR code reader!')
      return
    }

    // カメラの起動
    const codeReader = new BrowserQRCodeReader()
    codeReader.decodeFromVideoDevice(
      undefined, // 使用するカメラデバイス
      this.cameraRef.current, // カメラのDOM
      (result, exception, controls) => {
        // 起動中に動き続ける処理

        this.setState({scannerControls: controls}) // 外部から停止できるようにStateへ

        if (exception) {
          // 読み取れていない間はexceptionが投げられ続ける
          return
        }

        if (result) {
          // 読み取りに成功した場合
          const resultText = result.getText()
          const resultArray = this.state.readResultList

          if (resultArray.includes(resultText)) {
            // 既に読み取ったコードの場合
            return
          }

          this.setState({
            readResultList: resultArray.concat(resultText) // 読み取ったものから順に配列へ入れる
          })

          if (resultArray.length === this.props.numberOfReadCode - 1) {
            // 読み取り数に達したら
            this.props.onCompleteRead(resultArray.concat(resultText))

            controls.stop()
            this.setState({scannerControls: null})
          }
        }
      }
    )
  }

  // 起動中のカメラを停止
  stopCamera() {
    if (!this.state.scannerControls) {
      return
    }

    this.state.scannerControls.stop()
    this.setState({readResultList: [], scannerControls: null})
  }
  componentWillUnmount() {
    // コンポーネント破壊時にカメラ停止
    this.stopCamera()
  }

  render() {
    const resultList = this.state.readResultList;

    // QRリーダーの説明文の箇条書きリスト
    const QRReaderDescriptList = () => {
      const QRReaderDescriptions = [
        <Typography>「QRコードを読み取る」ボタンを押すとカメラが起動します。</Typography>,
        <Typography>必ず、<strong>左</strong>のQRコードから<strong>先に</strong>読み取って下さい。</Typography>,
        <Typography>2つのQRコードの読み取りが成功すると、自動で解読を開始します。</Typography>,
        <Typography>解読終了後、馬券の購入内容が表示されます。</Typography>
      ] // QRリーダーの説明文リスト

      const listItems = QRReaderDescriptions.map((item, index) => 
        <ListItem key={index} alignItems="flex-start">
          <ListItemIcon>
            <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={item}
          />
        </ListItem>
      )

      return <List>{listItems}</List>
    }

    // 読み取り状況の表示
    const readQRStatuses = Array(this.props.numberOfReadCode).fill(null).map((_, index) => {
      const label = `${index + 1}枚目: `
      const result = resultList[index]
      const width = result ? 120 : 72
      const status = result ? '完了' : '未'
      const textColor = result ? 'success.main' : 'text.disabled'
      const deleteIconButton = result ?
        <Tooltip title="取り消し">
          <IconButton color="warning" size="small" sx={{p: 0}}>
            <HighlightOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        : <></>

      return (
        <Stack key={index} width={width} direction="row" spacing={1}>
          <Typography variant="body1">
            {label}
          </Typography>
          <Typography fontWeight="bold" color={textColor}>{status}</Typography>
          {deleteIconButton}
        </Stack>
      )
    })

    // カメラ起動前の表示
    const SectionBeforeQRReader = () => {
      if (this.state.scannerControls !== null) { // ここで返すElementは数秒ごとに再レンダリングされるのでHiddenで実装
        return <></>
      }
      return <>
          <Typography variant="h6">
            馬券にある2つのQRコードをカメラで読み取り、その購入内容を表示します。
          </Typography>
          {QRReaderDescriptList()}
          <Divider variant="middle" />
          <Box width="100%" textAlign="center" mt={2}>
            <Button onClick={() => this.setupCamera()} variant="outlined">QRコードを読み取る</Button>
          </Box>
        </>
    }

    return (
      <Stack spacing={1}>
        <Typography variant="h5">
          馬券のQRコードを読み取る
        </Typography>
        <LinearProgress variant="determinate" value={100} color="secondary" />
        <Paper sx={{p: 2}}>
          <SectionBeforeQRReader />
          {/* 以下からカメラ起動中の表示 */}
          {/* `cameraRef`は条件付きレンダー不可、`hidden`での実装 */}
          <Stack display={this.state.scannerControls === null ? "none" : "block"} spacing={1}>
            <Alert severity="info">必ず、<strong>左</strong>のQRコードから<strong>先に</strong>読み取って下さい。</Alert>
            <video
              width="100%"
              ref={this.cameraRef}
            />
            <Card>
              <CardContent sx={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                <Typography fontWeight="bold" variant="subtitle2" mr={4}>読み取り状況</Typography>
                <Stack
                  flex={1} display="flex" justifyContent="center" direction="row" spacing={2}
                  divider={<Divider variant="middle" orientation="vertical" flexItem />}
                >
                  {readQRStatuses}
                </Stack>
              </CardContent>
            </Card>
            <Button onClick={() => this.stopCamera()} variant="outlined" fullWidth>カメラを閉じる</Button>
          </Stack>
        </Paper>
      </Stack>
    )
  }
}

export default QRCodeReader