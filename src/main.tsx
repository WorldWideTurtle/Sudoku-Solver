import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './components/contexts/theme-context';
import { HashRouter } from "react-router";
import { Sidebar } from './components/sidebar';
import { Footer } from './components/Footer';
import { Dialog } from './components/ui/dialog';
import { ToastContainer } from './components/ui/toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <ToastContainer/>
        <Dialog />
        <Sidebar />
        <main className='w-full flex-1 flex flex-col'>
          <App />
        </main>
        <Footer />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
