import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          fontSize: '14.5px',
        },
        standardSuccess: {
          backgroundColor: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
        standardError: {
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          color: '#b45309',
          border: '1px solid #fde68a',
        },
        standardInfo: {
          backgroundColor: '#eff6ff',
          color: '#1e40af',
          border: '1px solid #bfdbfe',
        },
        filledSuccess: {
          backgroundColor: '#10b981',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
        },
        filledError: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
        },
        filledWarning: {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
        },
        filledInfo: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
        },
        icon: {
          fontSize: '22px',
          opacity: 0.9,
        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            minWidth: '320px',
          }
        }
      }
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)