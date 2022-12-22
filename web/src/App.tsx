import './App.css';

import axios from './providors/axios';

function App() {
  async function handleReadCode() {
    const code = "10100022010110100200442287400909300994740630102030405000019012345678901234567890123456789012345"

    const params = new URLSearchParams({
      code: code
    })

    const response = await axios.get(`reader?${params}`);

    console.log(response.data);
  }

  return (
    <div className="back">
      <div className='App'>
        <h1>
          QRコードリーダー
        </h1>
        <button onClick={handleReadCode}>APIテスト</button>
      </div>
    </div>
  );
}

export default App;
