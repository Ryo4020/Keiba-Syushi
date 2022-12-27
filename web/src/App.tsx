import './App.css';

import Container from '@mui/material/Container';

import TicketQRReader from './components/TicketQRReader';
import GlobalHeader from './layouts/GlobalHeader';

function App() {
  return (
    <div className="back">
      <Container disableGutters={true} maxWidth="md">
        <GlobalHeader />
        <TicketQRReader />
      </Container>
    </div>
  )
}

export default App;
