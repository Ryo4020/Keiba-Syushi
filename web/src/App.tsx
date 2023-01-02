import './App.css';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Ticket from './components/Ticket';
import GlobalHeader from './layouts/GlobalHeader';

function App() {
  return (
    <div className="back">
      <Container disableGutters maxWidth="md" sx={{height: "100%", display: "flex", flexDirection: "column"}}>
        <GlobalHeader />
        <Box sx={{flexGrow: 1, bgcolor: "background.paper", overflow: "scroll"}}>
          <Ticket />
        </Box>
      </Container>
    </div>
  )
}

export default App;
