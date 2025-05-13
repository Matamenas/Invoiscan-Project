'use client';

import React, { useState, useEffect } from 'react';
import './style.css';
import Typography from '@mui/material/Typography';
import { AppBar, Box, Button, Toolbar, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const reviews = [
  { text: '"This product exceeded my expectations! a must-have."', image: '/images/rev1.jpg', image2: '/images/five-stars.png', title: 'Accountant', name: 'Sam Smith' },
  { text: '"I was impressed by how intuitive and helpful this tool is."', image: '/images/rev2.jpg', image2: '/images/five-stars.png', title: 'Product Manager', name: 'Joseph Malick' },
  { text: '"A brilliant tool for both professionals and casual users!"', image: '/images/rev5.jpg', image2: '/images/five-stars.png', title: 'UX Designer', name: 'Quansah McDufff' },
  { text: '"Innovative and highly efficient!"', image: '/images/rev4.jpg', image2: '/images/five-stars.png', title: 'UX Designer', name: 'Shane Law' },
];

export default function MenuAppBar() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const theme = useTheme();
  const [showNavBar, setShowNavBar] = useState(true); // Track if the navbar is visible
  const [lastScrollY, setLastScrollY] = useState(0); // Track the last scroll position
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavBar(false); // Scroll down -> hide navbar
      } else {
        setShowNavBar(true); // Scroll up -> show navbar
      }
      setLastScrollY(window.scrollY); // Update the last scroll position
    };

    // Attach scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handlePrev = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const review = reviews[currentReviewIndex];

  const redirectToLogin = () => {
    window.location.href = '/Login'
  }

  const redirectToDemo = () => {
    window.location.href = '/ScannerDemo'
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflowX: 'hidden' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="sticky"
        color="default"
        sx={{
          bgcolor: 'white',
          boxShadow: 'none',
          zIndex: 1100,
          transition: 'transform 0.3s ease-in-out',
          transform: showNavBar ? 'translateY(0)' : 'translateY(-100%)', // Hide or show the navbar
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img
              src="/images/ISLOGO.png"
              alt="InvoiceScan Logo"
              style={{
                width: '100%',
                maxWidth: '310px',
                height: 'auto',
                transition: 'opacity 0.3s ease-in-out',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            />
          </a>

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton sx={{ color: '#507b41' }} onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: '1rem', overflowX: 'hidden' }}>
              {['Home', 'Our Features', 'Reviews'].map((item) => (
                <Button key={item} variant="outlined" sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem'}}>
                  {item}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            padding: '1rem',
            width: 250,
            backgroundColor: 'white',
            color: '#507b41',
          }
        }}
      >
        <Box sx={{ width: 250, padding: '1rem' }}>
          {['Home', 'Our Features', 'Reviews'].map((item) => (
            <Button
              key={item}
              fullWidth
              variant="outlined"
              sx={{ color: '#507b41', borderColor: 'white', borderRadius: '5px', fontSize: '1.3rem', marginBottom: '1rem' }}
              onClick={toggleDrawer}
            >
              {item}
            </Button>
          ))}
        </Box>
      </Drawer>
 
      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '1rem', sm: '2rem' },
        height: 'calc(100vh - 64px)',
        flexDirection: { xs: 'column', sm: 'row' },
        overflowX: 'hidden' // Prevents horizontal overflow
      }}>

        {/* Text Section */}
<Box sx={{ maxWidth: { xs: '100%', sm: '50%' }, textAlign: { xs: 'center', sm: 'left' } }}>
  <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '1rem', marginTop: '3rem' }}>
    The Smart Scanner for your needs
  </Typography>
  <Typography variant="body1" sx={{ fontSize: '1.7rem', marginBottom: '2rem' }}>
    Scan less with your eyes and more with us!
    <br />
    InvoiceScan takes your data and digitizes it just for you
  </Typography>

  {/* Button Container */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '1.5rem' }}>
    <Button variant="contained" sx={{
      backgroundColor: '#507b41',
      color: 'white',
      borderRadius: '10px',
      padding: '15px 25px',
      fontSize: '1.3rem',
      flex: 1
    }} onClick={redirectToDemo}>
      <strong>Try Now</strong>
    </Button>

    <Button variant="contained" sx={{
      backgroundColor: 'white',
      color: '#507b41',
      borderRadius: '10px',
      padding: '15px 25px',
      fontSize: '1.3rem',
      flex: 1
    }} onClick={redirectToLogin}>
      <strong>LOG IN</strong>
    </Button>

    <Button variant="contained" sx={{
      backgroundColor: '#507b41',
      color: 'white',
      borderRadius: '10px',
      padding: '15px 25px',
      fontSize: '1.3rem',
      flex: 1
    }} onClick={redirectToLogin}>
      <strong>SIGN UP</strong>
    </Button>
  </Box>
</Box>

       {/* Image Section */}
<Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: { xs: '2rem', sm: 0 } }}>
  <img
    src="/images/samsungphone.png"
    alt="Samsung Phone"
    style={{
      width: '50%', // Increase width but still make it responsive
      maxWidth: '250px', // Adjust max width to allow for bigger images
      height: 'auto',
      borderRadius: '10px',
      position: 'absolute',
      left: '15%', // Adjust position to better center the image
      top: '-10%', // Adjust vertical positioning
      zIndex: 2,
    }}
  />
  <img
    src="/images/macbook.png"
    alt="MacBook"
    style={{
      width: '70%', // Increase width for the MacBook image
      maxWidth: '600px', // Allow larger max width
      height: 'auto',
      borderRadius: '10px',
      zIndex: 1,
    }}
  />
</Box>
</Box>

  {/* Features Section */}
<Box sx={{
  padding: '4rem',
  backgroundColor: '#f9f9f9',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}}>
  <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '2rem', textDecoration: 'underline' }}>
    Our Features
  </Typography>

  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
    gap: '3rem',
    justifyContent: 'center',
    maxWidth: '1000px',
  }}>
    {/* Feature Items */}
    {[
      { title: 'Environmentally Friendly', description: 'Our application helps reduce paper waste by offering digital receipts and tracking.' },
      { title: 'Receipt Scanning', description: 'Easily scan and store receipts with our powerful OCR technology.' },
      { title: 'Mobile-Friendly', description: 'Our platform is fully optimized for mobile, making it easy to use on the go.' },
      { title: 'Easy to Use', description: 'A simple and intuitive interface ensures a smooth experience for all users.' }
    ].map((feature, index) => (
      <Box key={index} sx={{ textAlign: 'center' }}>
        <img
          src={`/images/feature${index + 1}.png`} // Use different images for each feature
          alt={feature.title}
          style={{ width: '80px', height: '80px', marginBottom: '1rem' }}
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {feature.title}
        </Typography>
        <Typography variant="h6" sx={{ marginTop: '0.5rem' }}>
          {feature.description}
        </Typography>
      </Box>
    ))}
  </Box>
</Box>


      {/* Reviews Section */}
      <br></br>      <br></br>
      <br></br>
      <br></br>

      <Box sx={{ textAlign: 'center', marginTop: '2rem', position: 'relative' }}>
  <Typography variant="h3" sx={{ marginBottom: '2rem', fontWeight: 'bold', textDecoration: 'underline' }}>
    What Our Clients Say
  </Typography>

  <br></br>      <br></br>
      <br></br>
      <br></br>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ArrowBackIos
      sx={{ fontSize: '3rem', cursor: 'pointer' }}
      onClick={handlePrev}
    />


    
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      gap: '1rem',
      alignItems: 'center' // Ensures the content inside this box is centered horizontally
    }}>

<br></br>      <br></br>
   
      <img
        src={review.image}
        alt={review.name}
        style={{ width: '206px', height: '200px', borderRadius: '50%' }}
      />

      <br></br>
      <Typography variant="body1" sx={{ fontSize: '1.3rem', fontWeight: '400' }}>

      <br></br>
        {review.text}
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {review.name} - {review.title}
      </Typography>
    </Box>
    <ArrowForwardIos
      sx={{ fontSize: '3rem', cursor: 'pointer' }}
      onClick={handleNext}
    />
  </Box>
</Box>



        <br></br> 
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
   {/* Final Section */}
<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: { xs: '4rem 2rem', sm: '6rem 3rem', md: '8rem 6rem' },
    backgroundColor: '#2a2e41',
    borderTop: '2px solid #ddd',
    flexWrap: 'wrap',
    flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens
    textAlign: { xs: 'center', md: 'left' }, // Center text on small screens
    gap: { xs: '2rem', md: '0' }, // Add spacing when stacked
  }}
>
  {/* Left Side - Logo & Product Name */}
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem',
      flexDirection: { xs: 'column', sm: 'row' }, // Stack logo/text on small screens
    }}
  >
    <a href="/" style={{ textDecoration: 'none' }}>
      <img 
        src="/images/ISFOOTERLOGO.png"
        alt="InvoiceScan Logo" 
        style={{ 
          width: '200px', 
          height: '60px',
          transition: 'opacity 0.3s ease-in-out',
          cursor: 'pointer',
        }} 
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      />
    </a>

    <Typography 
      variant="h6" 
      sx={{ color: 'white', paddingLeft: { xs: '0', sm: '1rem' } }}
    >
      © 2024 Invoiscan LLC. All rights reserved
    </Typography>
  </Box>

  {/* Right Side - Buttons */}
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem',
      flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on small screens
    }}
  >
    <Typography variant="h6" sx={{ color: 'white' }}>
      TRY FOR FREE
    </Typography>

    {/* Google Play Button */}
    <Button 
      variant="contained" 
      sx={{ 
        backgroundColor: '#4caf50', 
        color: 'white', 
        fontSize: '1rem', 
        fontWeight: 'bold',
        padding: '10px 20px',
        display: 'flex', 
        alignItems: 'center',
        gap: '10px',
        minWidth: '180px', // Ensures button size consistency
        '&:hover': { backgroundColor: '#388e3c' }
      }}
    >
      <img 
        src="/images/google-play.png" 
        alt="Google Play" 
        style={{ width: '20px', height: '20px' }} 
      />
      GOOGLE PLAY
    </Button>

    {/* Apple Play Button */}
    <Button 
      variant="contained" 
      sx={{ 
        backgroundColor: '#4caf50', 
        fontWeight: 'bold',
        color: 'white', 
        fontSize: '1rem', 
        padding: '10px 20px',
        display: 'flex', 
        alignItems: 'center',
        gap: '10px',
        minWidth: '180px',
        '&:hover': { backgroundColor: '#388e3c' }
      }}
    >
      <img 
        src="/images/app-store.png" 
        alt="Apple Store" 
        style={{ width: '20px', height: '20px' }} 
      />
      APPLE PLAY STORE
    </Button>
  </Box>
</Box>




      </Box>
  );
}
