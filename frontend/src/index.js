import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Navbar from './Navbar'
import Home from './Home'
import Pass from './Passwords'
import Generator from './Generator';
import PasswordChange from './PasswordChange'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/dodaj" element={<App />} />
                <Route path="/hasla" element={<Pass />} />
                <Route path="/generator" element={<Generator />} />
                <Route path="/zmienHaslo" element={<PasswordChange />} />
            </Routes>
        </Router>
  </React.StrictMode>
);
