import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import App from './App.tsx'
// import './pusher-test';


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <App />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
      </BrowserRouter>
   
  // </StrictMode>,
)
