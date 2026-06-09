import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Container } from '@mui/material';
import Box from '@mui/material/Box';

import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Header from './components/Header';
import Footer from './components/Footer';

import TasksMain from './components/tasks/TasksMain';
import Login from './components/users/Login';

export default function App() {
  return (
    <AuthProvider>
      <Box sx={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh'
      }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Container maxWidth="md">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute><TasksMain /></ProtectedRoute>
                } />
                <Route path="/login" element={<Login nextURL='/' />} />
              </Routes>
            </BrowserRouter>
          </Container>
        </Box>
        <Footer />
      </Box>
    </AuthProvider>
  );
}
