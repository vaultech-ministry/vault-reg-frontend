import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './input.css'
import App from './App.jsx'


const removeLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 500); 
  }
};

const Root = () => {
  useEffect(() => {
    removeLoader();
  }, []);

  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
