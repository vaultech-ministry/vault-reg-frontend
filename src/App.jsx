import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './auth/Login';
import { isAuthenticated } from './utils/auth';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react';

function App() { 
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/login' element={isAuth ? <Navigate to="/" replace /> : <Login setIsAuth={setIsAuth} />} />
        <Route path='/*' element={isAuth ? <Layout /> : <Navigate to="/login" replace />} />
      </Routes>
      <Toaster position='top-center'/>
      <Analytics />
    </Router>
  );
}

export default App;
