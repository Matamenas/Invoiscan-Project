'use client';

import React, { useState } from 'react';
import './style.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const reviews = [
  {
    text: 'Great product, would try again',
    image: '/images/rev1.png', 
    title: 'Accountant',
    name: 'Sam Smith',
  },

  {
    text: 'Fantastic stuff, great application',
    image: '/images/rev5.png', 
    title: 'UI Designer',
    name: 'Joe McDuff',
  },
  

  {
    text: 'Really helpful and easy to use',
    image: '/images/rev2.png', 
    title: 'Product Manager',
    name: 'Jospeh Malick',
  },
  {
    text: 'Fantastic tool for everyday use',
    image: '/images/rev3.png', 
    title: 'UX Designer',
    name: 'Jessica Pearson',
  },

  {
    text: 'Fantastic tool for everyday use',
    image: '/images/rev4.png', 
    title: 'UX Designer',
    name: 'Shane Law',
  },
];

export default function MenuAppBar() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

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

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflowY: 'auto' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" color="default" sx={{ bgcolor: 'white', color: 'white', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <img
            src="/images/ISLOGO.png"
            alt="Logo"
            style={{
              width: '290px',
              height: 'auto',
            }}
          />

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            {['Home', 'About Us', 'Visit', 'Contact'].map((item) => (
              <Button
                key={item}
                variant="outlined"
                sx={{
                  color: '#90ee90',
                  borderColor: 'white',
                  borderRadius: '5px',
                  fontSize: '1.2rem',
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Buttons at the Top Right */}
          <Box>
            {/* SIGN UP BUTTON */}
            <Button
              variant="outlined"
              sx={{
                marginRight: '10px',
                color: '#90ee90',
                borderColor: 'white',
                borderRadius: '5px',
                fontSize: '1.2rem',

              }}
              onClick={() => alert('Sign Up button clicked!')}
            >
              Sign Up
            </Button>

            {/* LOG IN BUTTON */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#90ee90',
                borderRadius: '5px',
                borderColor: '#90ee90',
                fontSize: '1.2rem',
                border: '3px solid #90ee90'

              }}
              onClick={() => alert('Log In button clicked!')}
            >
              Log In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem',
          height: 'calc(100vh - 64px)', // Adjust height for AppBar
        }}
      >
        {/* Text Section */}
        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginLeft: '3rem', marginBottom: '1rem' }}>
            The Smart Scanner for your needs
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.7rem', marginBottom: '2rem', marginLeft: '3rem' }}>
            Scan less with your eyes and more with us! <br />InvoiceScan takes your data and digitizes it just for you
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#90ee90',
              color: 'white',
              borderRadius: '10px',
              padding: '15px 25px',
              fontSize: '1.3rem',
              marginLeft: '3rem',
            }}
            onClick={() => alert('Try Now button clicked!')}
          >
            <strong>Try Now</strong>
          </Button>
        </Box>

        {/* Image Section */}
        {/* Image Section */}
<Box sx={{ position: 'relative', display: 'flex', gap: '1.5rem', marginRight: '4.5rem' }}>
  {/* Image 1 (Samsung Phone) */}
  <img
    src="/images/samsungphone.png"
    alt="Samsung Phone"
    style={{
      width: '300px',
      height: 'auto',
      borderRadius: '10px',
      position: 'absolute', // Make it overlap
      left: '10%', // Adjust to position the phone
      top: '-20%',
      transform: 'translateX(-50%)', // Center it horizontally over the MacBook
      zIndex: 2, // Ensure it's on top of the MacBook
    }}
  />

  {/* Image 2 (MacBook) */}
  <img
    src="/images/macbook.png"
    alt="MacBook"
    style={{
      width: '650px',
      height: 'auto',
      borderRadius: '10px',
      zIndex: 1, // MacBook goes below the phone
    }}
  />
</Box>

      </Box>

    {/* Features Section */}
<Box
  sx={{
    padding: '3rem',
    backgroundColor: '#f9f9f9', // Optional background color for better contrast
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'center', // Center the content
    flexDirection: 'column', // Stack the features vertically
    alignItems: 'center',
  }}
>
  {/* Features Heading */}
  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '2rem' }}>
    Features:
    <br />
    <span>These are all the features of our product:</span>
  </Typography>

  {/* Feature Icons and Descriptions */}
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Creates a 2x2 grid layout
      gap: '2rem', // Space between items
      justifyContent: 'center',
      maxWidth: '900px', // Max width for better alignment
    }}
  >
    {/* Feature 1 */}
    <Box
      sx={{
        width: '150px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '10px',
      }}
    >
      <img src="/images/earth.png" alt="Feature 1" style={{ width: '60px', height: '60px' }} />
      <Typography variant="h6" sx={{ marginTop: '10px', textAlign: 'center' }}>
        Environmentally Friendly
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Helps reduce paper waste and supports a greener workflow.
      </Typography>
    </Box>

    {/* Feature 2 */}
    <Box
      sx={{
        width: '150px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '10px',
      }}
    >
      <img src="/images/reciept.png" alt="Feature 2" style={{ width: '60px', height: '60px' }} />
      <Typography variant="h6" sx={{ marginTop: '10px', textAlign: 'center' }}>
        Receipt Scanning
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Digitizes your receipts for easy record keeping.
      </Typography>
    </Box>

    {/* Feature 3 */}
    <Box
      sx={{
        width: '150px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '10px',
      }}
    >
      <img src="/images/review.png" alt="Feature 3" style={{ width: '60px', height: '60px' }} />
      <Typography variant="h6" sx={{ marginTop: '10px', textAlign: 'center' }}>
        Reviews
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Collects and analyzes customer feedback for better service.
      </Typography>
    </Box>

    {/* Feature 4 */}
    <Box
      sx={{
        width: '150px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '10px',
      }}
    >
      <img src="/images/mobile.png" alt="Feature 4" style={{ width: '60px', height: '60px' }} />
      <Typography variant="h6" sx={{ marginTop: '10px', textAlign: 'center' }}>
        Mobile-Friendly
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Optimized for use on any mobile device, anytime, anywhere.
      </Typography>
    </Box>
  </Box>
</Box>

      {/* Reviews Section */}
      <Box sx={{ textAlign: 'center', marginTop: '3rem' }}>
        <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
          Reviews
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
          {review.text}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
          <ArrowBackIos onClick={handlePrev} sx={{ cursor: 'pointer', fontSize: '2rem' }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={review.image}
              alt={review.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                marginBottom: '1rem',
              }}
            />
            <Typography variant="h6">{review.name}</Typography>
            <Typography variant="subtitle2">{review.title}</Typography>
          </Box>

          <ArrowForwardIos onClick={handleNext} sx={{ cursor: 'pointer', fontSize: '2rem' }} />
        </Box>
      </Box>
    </Box>
  );
}
