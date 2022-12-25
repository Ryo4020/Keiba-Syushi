import './App.css';

import TicketQRReader from './components/TicketQRReader';
import GlobalHeader from './layouts/GlobalHeader';

function App() {
  return (
    <div className="back">
      <div className='App'>
        <GlobalHeader />
        <TicketQRReader />
      </div>
    </div>
  )
}

export default App;
