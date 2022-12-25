import React from "react";

import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser"

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

    // 読み取り状況の表示
    const readQRStatuses = Array(this.props.numberOfReadCode).fill(null).map((_, index) => {
      const label = `${index + 1}枚目: `
      const result = resultList[index]
      const status = result ? '完了' : '未'
      const textColor = result ? 'green' : 'gray'
      return (
        <div key={index}>
          {label}<strong style={{color: textColor}}>{status}</strong>
        </div>
      )
    })

    // カメラ説明や制御にまつわる表示
    const QRReaderSection = () => {
      if (this.state.scannerControls === null) { // カメラ非表示
        return <>
          <ul style={{width: "50%", textAlign: "left", margin: "0 auto"}}>
            <li>馬券にある2つのQRコードをカメラで読み取るとその購入内容を表示します。</li>
            <li>ボタンを押すとカメラが起動します。</li>
            <li>必ず、<strong>左</strong>のQRコードから<strong>先に</strong>読み取って下さい。</li>
          </ul>
          <button onClick={() => this.setupCamera()}>QRコードを読み取る</button>
        </>
      } else {
        return <>
            <div>
              <p>読み取り状況</p>
              <div style={{width: "600px", margin: "0 auto", display: "flex", justifyContent: "space-around"}}>{readQRStatuses}</div>
            </div>
            <p>必ず、<strong>左</strong>のQRコードから<strong>先に</strong>読み取って下さい。</p>
            <button onClick={() => this.stopCamera()}>カメラを閉じる</button>
        </>
      }
    }

    return (<>
        <video
          hidden={this.state.scannerControls === null}
          width={600}
          ref={this.cameraRef}
        />
        <QRReaderSection />
      </>
    )
  }
}

export default QRCodeReader