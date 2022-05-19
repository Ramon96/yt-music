import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import { Playlist } from './features/youtube/youtubeComponent';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div>
      <header>

      </header>
      <CssBaseline />
      <Container>
        Hello!
        <Playlist />
      </Container>
    </div>
  );
}

export default App;
