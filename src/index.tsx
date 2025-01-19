import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './components/contexts/theme-context';
import { HashRouter } from "react-router-dom";
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
