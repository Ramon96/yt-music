// Components
import { Playlist } from './features/youtube/youtubeComponent';


//MUI components
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="md">
        <header>
          <Typography variant="h1">
            Offline Playlists
        </Typography>
        </header>
        <Playlist />
      </Container>
    </div>
  );
}

export default App;
