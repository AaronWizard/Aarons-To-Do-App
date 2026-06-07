import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import theme from './themes/theme'
import App from './App.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
