// src/app/smallapp/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function MyApp() {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVideo(document.getElementById("video"));
    setCanvas(document.getElementById("canvas"));
    setPhoto(document.getElementById("photo"));

    if (video && canvas && photo) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => console.error(`An error occurred: ${err}`));
    }
  }, [video, canvas, photo]);

  const capturePhoto = () => {
    const context = canvas.getContext('2d');
    if (video && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      sendImageToServer(data);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        photo.setAttribute('src', base64Image);
        sendImageToServer(base64Image);
      };
      img.src = base64Image;
    };
    reader.readAsDataURL(file);
  };

  const sendImageToServer = async (imageData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      document.getElementById('store-name').innerText = `Store: ${data.storeName || 'Not found'}`;
      document.getElementById('total').innerText = `Total: ${data.total || 'Not found'}`;
      document.getElementById('vat').innerText = `VAT: ${data.vat || 'Not found'}`;
      document.getElementById('date').innerText = `Date: ${data.date || 'Not found'}`;
      document.getElementById('vat-reg').innerText = `VAT Registration: ${data.vatReg || 'Not found'}`;
      document.getElementById('full-text').innerText = data.fullText;
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to process image: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InvoiceScan OCR
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="h4" align="center">Capture or Upload an Image</Typography>

        <video id="video" style={{ width: '100%', maxHeight: '200px' }}></video>
        <canvas id="canvas" style={{ display: 'none' }}></canvas>
        <img id="photo" alt="Captured" style={{ width: '100%', maxHeight: '100%', marginTop: '20px' }} />

        <Button variant="contained" color="primary" onClick={capturePhoto} disabled={loading}>
          {loading ? 'Processing...' : 'Capture Photo'}
        </Button>

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">OCR Results:</Typography>
          <div id="store-name"></div>
          <div id="total"></div>
          <div id="vat"></div>
          <div id="date"></div>
          <div id="vat-reg"></div>
          <br></br>
          <b>Full Extracted Text:</b>
          <div id="full-text"></div>
        </Box>
      </Box>
    </Box>
  );
}
