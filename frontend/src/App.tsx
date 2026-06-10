import { Container } from '@mui/material';
import Box from '@mui/material/Box';

import { AuthProvider } from './components/auth/AuthContext';

import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

export default function App() {
  return (
    <AuthProvider>
      <Box sx={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh'
      }}>
        <Header />
        <Container component="main" maxWidth="md">
          <Box sx={{ flexGrow: 1, py: 3 }}>
            <Main />
          </Box>
        </Container>
        <Footer />
      </Box>
    </AuthProvider>
  );
}
