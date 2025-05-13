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
import Dashboard from "../api/dashboard/route";


export default function MyApp() {
  //const [data, setData] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showDash, setShowDash] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDocumentOverview, setDocumentOverview] = useState(false);
  const [showScanner, setScanner] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('../api/sessionHandling');
      if (response.ok) {
        const session = await response.json();
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    fetchSession();
  }, []);

 // if (!data) return <p>Loading...</p>;

  //Toggle functions for the different views
  function runShowRegister() {
    setShowLogin(false);
    setShowDash(false);
    setShowRegister(true);
    setShowAdmin(false);
  }

  function runShowLogin() {
    setShowLogin(true);
    setShowDash(false);
    setShowRegister(false);
    setShowAdmin(false);
  }

  //Handling login success
  const handleLoginSuccess = () => {
    //Set login state to true
    setIsLoggedIn(true);
    //Hide the login page
    setShowLogin(false);
    //Show the dashboard after successful login
    setShowDash(true);
    setShowAdmin(false);
  };

  // Handle Register success
  const handleRegisterSuccess = () => {
    //Set login state to true
    setIsLoggedIn(true);
    //Hide the registration page
    setShowRegister(false);
    //Show the dashboard after registration
    setShowDash(true);
  };

  //Handling Dashboard Redirecting
  const handleDashboardSuccess = () => {
    setShowDash(false);
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
                  <Button variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={handleLoginSuccess}>Document Overview</Button>
                  {/* I updated it to call handleLogout */}
                  <Button variant="outlined" sx={{ color: 'red', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={handleLogout}>Logout</Button>
                </>
            ) : (
                <>
                  <Button style={{textAlign: "left"}} variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={redirectToHome}>Home</Button>
                  <Button variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={runShowLogin}>Login</Button>
                  <Button variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}} onClick={runShowRegister}>Register</Button>
                </>
            )}
          </Toolbar>
        </AppBar>

        {/* Once called, each of these functions will render in the appropriate components */}
        {showRegister && (
            <Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
              <Register onSuccess={handleRegisterSuccess}/>
            </Box>
        )}
        {showLogin && (
            <Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
              <Login onSuccess={handleLoginSuccess}/>
            </Box>
        )}
        {/* Only if the user is logged will the dashboard be set to true */}
        {showDash && isLoggedIn && (
            <Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
              <Dashboard showProducts={handleDashboardSuccess}/>
            </Box>
        )}
      </Box>
  );
}
