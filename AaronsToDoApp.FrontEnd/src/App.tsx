import Box from '@mui/material/Box';

import Header from './components/Header';
import Footer from './components/Footer';
import TasksMain from './components/tasks/TasksMain';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <TasksMain />
      </Box>
      <Footer />
    </Box>
  );
}
