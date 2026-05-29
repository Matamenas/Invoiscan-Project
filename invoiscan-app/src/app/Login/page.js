'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import Register from '../api/register/route';
import Login from "../api/login/route";


export default function MyApp() {
  //const [data, setData] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('../api/sessionHandling');
      if (response.ok) {
        const session = await response.json();
        setIsLoggedIn(true);
        if (session?.accType === 'Manager') {
          window.location.href = '/Accountant';
        } else {
          window.location.href = '/Scanner';
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    fetchSession();
  }, []);

  const handleRegisterSuccess = () => {
    window.location.href = '/Scanner';
  };

  const redirectToHome = () => {
    window.location.href = "/Home"
  }
  const handleLogout = async () => {
    try {
      const response = await fetch('../api/logoutHandling', { method: 'DELETE' });
      if (response.ok) {
        alert('You have been logged out.');
        setIsLoggedIn(false);
        setShowDash(false);
        const sessionCheck = await fetch('../api/sessionHandling');
        if (!sessionCheck.ok) {
          console.log('Session successfully destroyed.');
        } else {
          console.error('Session still active:', await sessionCheck.json());
        }
      } else {
        console.error('Failed to log out.');
        const errorDetails = await response.json();
        console.error(errorDetails);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  return (
      <Box sx={{flexGrow: 1}}>
      <AppBar
        position="sticky"
        color="default"
        sx={{
          bgcolor: 'white',
          boxShadow: 'none',
          zIndex: 1100,
          transition: 'transform 0.3s ease-in-out',
        }}>
          <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2}}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" style={{ textDecoration: 'none' }}>
            <img
              src="/images/ISLOGO.png"
              alt="InvoiceScan Logo"
              style={{
                width: '100%',
                maxWidth: '310px',
                height: '60px',
                transition: 'opacity 0.3s ease-in-out',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            />
          </a>
            </Typography>

            {isLoggedIn ? (
                <>
                  <Typography variant="body1" sx={{ color: '#507b41' }}>Redirecting...</Typography>
                </>
            ) : (
                <>
                  <Button style={{textAlign: "left"}} variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={redirectToHome}>Home</Button>
                  <Button variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={() => setShowRegister(false)}>Login</Button>
                  <Button variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={() => setShowRegister(true)}>Register</Button>
                </>
            )}
          </Toolbar>
        </AppBar>

        {/* Once called, each of these functions will render in the appropriate components */}
        <Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
          {showRegister ? (
            <Register onSuccess={handleRegisterSuccess} />
          ) : (
            <Login onSuccess={() => {}} />
          )}
        </Box>
      </Box>
  );
}
