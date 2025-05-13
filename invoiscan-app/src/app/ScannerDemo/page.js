// src/app/Scanner/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, AppBar, Toolbar, IconButton, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Scanner() {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [ocrData, setOcrData] = useState({
    storeName: '',
    total: '',
    vat: '',
    date: '',
    vatReg: '',
    fullText: '',
  })

  // some functions and variables to handle video capture
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

  // function to capture a photo and store it in a variable
  // new picture = new picture this means that every photo is overridden no photo is saved
  // yet......!
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

  // a function to handle images uploaded
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
    try{
      reader.readAsDataURL(file);
    }
    catch(error){
      console.error("no idea why this error is coming up: ", error)
    }
  };

  // function to send the image provided to the OCR for processing
  // this may need to get changed soon as raw pictures aren't great
  // TODO: implement a process where the image sent over is processed to turn into black and white/grayscale and only then after that
  // to send to OCR for character recognition
  const sendImageToServer = async (imageData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/DemoOCR', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setOcrData({
        storeName: data.storeName || 'Not found',
        total: data.total || 'Not found',
        vat: data.vat || 'Not found',
        date: data.date || 'Not found',
        vatReg: data.vatReg || 'Not found',
        fullText: data.fullText || 'Not found'
      });
      setOpen(true); 
      // open dialog after OCR processing
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to process image: ${error.message}`);
    }

    setLoading(false);
  };

  // now we must add the fun stuff
  // Form dialog

  const handleFormOpen = () => {
      setOpen(true);
  };

  const handleFormClose = () => {
    setOpen(false);
  };

  const redirectToHome = () => {
    window.location.href = "/Home"
  }

  const handleSubmit = () => {
    console.log("Form Submitted with the following data", ocrData.storeName, ocrData.total)
    alert("Form Submitted with the following data" + " Provider: " + ocrData.storeName + " Total: " + ocrData.total + " Vat Reg: " + ocrData.vatReg)
    handleFormClose()
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{backgroundColor: "DarkGreen"}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InvoiScan DEMO!
          </Typography>

          <Button onClick={redirectToHome} color='white'> Home </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="h4" align="center">Capture or Upload an Image</Typography>

        <video id="video" style={{ width: '100%', maxHeight: '200px' }}></video>
        <canvas id="canvas" style={{ display: 'none' }}></canvas>

        <img id='photo' alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '1000px' }} />
        <br></br>
        <Button variant="contained" color="primary" onClick={capturePhoto} disabled={loading}>
          {loading ? 'Processing...' : 'Capture Photo'}
        </Button>
        <br></br>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        


        

      <br></br>
      <Dialog open={open} onClose={handleFormClose} fullWidth maxWidth="md">
        <DialogTitle>OCR Results</DialogTitle>
          <DialogContent>
            <Box display="flex" gap={2}>
            {/* Left Side: Image Preview */}
              <Box flex={1} display="flex" justifyContent="center">
              <img src={photo?.src} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '700px', objectFit: "contain" }} />
            </Box>

            {/* Right Side: Form Fields */}
            <Box flex={1}>
              <DialogContentText>Does This Look Correct?</DialogContentText>
        
              <TextField
                margin="dense"
                label="Provider"
                type="text"
                fullWidth
                variant="standard"
                value={ocrData.storeName}
                onChange={(e) => setOcrData({ ...ocrData, storeName: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Total"
                type="text"
                fullWidth
                variant="standard"
                value={ocrData.total}
                onChange={(e) => setOcrData({ ...ocrData, total: e.target.value })}
              />
              <TextField
                margin="dense"
                label="VAT"
                type="text"
                fullWidth
                variant="standard"
                value={ocrData.vat}
                onChange={(e) => setOcrData({ ...ocrData, vat: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Date"
                type="text"
                fullWidth
                variant="standard"
                value={ocrData.date}
                onChange={(e) => setOcrData({ ...ocrData, date: e.target.value })}
              />
              <TextField
                margin="dense"
                label="VAT Registration"
                type="text"
                fullWidth
                variant="standard"
                value={ocrData.vatReg}
                onChange={(e) => setOcrData({ ...ocrData, vatReg: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <br></br>
      <Button onClick={handleFormOpen} variant="contained" color="primary" style={{backgroundColor: "Green"}}>Open Form Validation</Button>
      <br></br>
      Extracted Text:
      <div style={{width:'250px', objectFit: "contain"}} 
      label="Full Text"
      display="block"
      onChange={(e) => setOcrData({...ocrData, fullText: e.target.value})}
      >{ocrData.fullText}</div>
    </Box>
  </Box>
  );
}
