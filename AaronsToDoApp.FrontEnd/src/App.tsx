import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import TasksMain from './components/tasks/TasksMain';
import { Container } from '@mui/material';
import Login from './components/users/Login';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="md">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<TasksMain />} />
              <Route path="/login" element={<Login nextURL='' />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
