// src/app/Scanner/page.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGrid } from '@mui/x-data-grid';

export default function Scanner() {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const categories = [
    "Groceries",
    "Utilities",
    "Transport",
    "Dining",
    "HealthCare",
    "Entertainment",
    "Other"
  ];

  const [ocrData, setOcrData] = useState({
    storeName: '',
    total: '',
    category: '',
    vat: '',
    date: '',
    vatReg: '',
    fullText: '',
  });

  const [showDocuments, setShowDocuments] = useState(false);
  const [showScanner, setShowScanner] = useState(true);

  const [data, setData] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [vatSum, setVatSum] = useState(0);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editableData, setEditableData] = useState({
    receiptImage: '',
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [session, setSession] = useState(null)
  const isManager = session?.accType === 'Manager';
  const documentGridTemplate = isManager
    ? '0.5fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'
    : '0.5fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr';

  // check for who is logged
   useEffect(() => {
      const fetchSession = async () => {
        const response = await fetch('../api/sessionHandling');
        if (response.ok) {
          const sessionData = await response.json();
          setSession(sessionData)
        } else {
          console.log("not logged in")
          alert("Please Login!")
        }
      };
      fetchSession();
    }, []);
  

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
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("../api/uploadImage",{
      method:"POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setEditableData({...editableData, receiptImage: data.url});
    }

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
      console.error("Error uploading image", error)
    }
  };

  // function to send the image provided to the OCR for processing
  const preprocessImage = (base64Image) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        // Convert to grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
  
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };
  
  const sendImageToServer = async (imageData) => {
    setLoading(true);
  
    try {
      const processedImage = await preprocessImage(imageData);
      const response = await fetch("../../pages/api/ocrScanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: processedImage }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      setOcrData({
        storeName: data.storeName || "Not found",
        total: data.total || "Not found",
        vat: data.vat || "Not found",
        date: data.date || "Not found",
        vatReg: data.vatReg || "Not found",
        fullText: data.fullText || "Not found",
      });
  
      setOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to process image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  
  
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

  const redirectToLogin = () => {
    window.location.href = "/Login"
  }

  const handleLogout = async () => {
    try {
      await fetch('../api/sessionHandling', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    window.location.href = '/Login';
  }

  const toggleDrawer = (openState) => {
    setDrawerOpen(openState);
  }

  function runShowDocuments(){
    setShowDocuments(true);
    setShowScanner(false);
  }

  function runShowScanner(){
    setShowDocuments(false);
    setShowScanner(true);
  }

  // handles the sending of data to the database
  const handleSubmit = async () => {
    console.log("Form Submitted with the following data:", ocrData);
    try {
      const response = await fetch(`../api/ocrDataSending`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: session?.email, storeName: ocrData.storeName, vatReg: ocrData.vatReg, date: ocrData.date, vat: ocrData.vat, total: ocrData.total, category: ocrData.category, receiptImage: editableData.receiptImage}), 
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Error sending OCR data:", error);
    }
  
    handleFormClose();
  };
  

  // get all the documents and add up the vat and totals
  useEffect(() => {
    fetch('../api/ocrDataRetrieval')
      .then((res) => res.json())
      .then((data) => {
        const documentArray = Array.isArray(data) ? data : [];
        setData(documentArray);

        const totalSum = documentArray.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
        const vatSum = documentArray.reduce((acc, item) => acc + (parseFloat(item.vat) || 0), 0);
        setTotalSum(totalSum);
        setVatSum(vatSum);
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
        setData([]);
      });
    }, []);

    const handleEdit = (index) => {
      setEditingIndex(index);
      setEditableData({ ...data[index] }); // pre-fill with current data
    };
    
    // Handle form submit for edited data
    const handleSaveEdit = async () => {
      if (!editableData.storeName || !editableData.total || !editableData.vat) {
        alert("Please fill out all fields.");
        return;
      }
    
      try {
        const response = await fetch(`/api/updateDocument`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editableData),
        });
    
        if (!response.ok) throw new Error("Failed to save changes");
    
        // Update the data locally
        const updatedData = [...data];
        updatedData[editingIndex] = editableData;
        setData(updatedData);
    
        setEditingIndex(null);
        setEditDialogOpen(false);
        setEditableData({ receiptImage: '' });
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Failed to save data.");
      }
    };

    const handleUpdateStatus = async (id, status) => {
      try {
        const response = await fetch(`../api/updateDocument`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id, status }),
        });

        if (!response.ok) throw new Error('Failed to update status');

        const updatedData = data.map((item) =>
          item._id === id ? { ...item, status } : item
        );
        setData(updatedData);
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update document status.');
      }
    };

    const handleDelete = async (index) => {
      if (window.confirm("Are you sure you want to delete this document?")) {
        try {
          const response = await fetch(`../api/deleteDocument`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data[index]._id }),
          });
    
          if (!response.ok) throw new Error("Failed to delete");
    
          // Remove item from the local state
          const updatedData = data.filter((_, i) => i !== index);
          setData(updatedData);
        } catch (error) {
          console.error("Error deleting data:", error);
          alert("Failed to delete document.");
        }
      }
    };
    


    // This Function is used to export everything gathered so far to a CSV
    const exportToCSV = () => {
      if (!data || data.length === 0) {
        alert("No data to export.");
        return;
      }
      
      const headers = ["No.", "Provider", "Category", "Status", "Document No.", "Date", "VAT", "Total"];
      const rows = data.map((item, index) => [
        index + 1,
        item.storeName,
        item.category,
        item.status || 'pending',
        item.vatReg,
        item.date,
        parseFloat(item.vat).toFixed(2),
        parseFloat(item.total).toFixed(2),
      ]);
      
      const summaryRow = [
        '',
        '',
        '',
        '',
        'Total Vat:',
        vatSum.toFixed(2),
        'Grand Total:',
        totalSum.toFixed(2)
      ];

      const csvRows = [...rows, summaryRow];

      let csvContent = "data:text/csv;charset=utf-8," 
        + [headers, ...csvRows].map(e => e.join(",")).join("\n");
    
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "ocr_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    /////////////////////////// CSV END ///////////////////////////
    

    // This function is used to check the status of the document and return the appropriate color and image for the status
    const checkDocumentStatus = (status) => {
      if (status === 'approved') return { color: 'green', img: '/images/approved.png' };
      if (status === 'declined') return { color: 'red', img: '/images/declined.png' };
      if (status === 'pending') return { color: 'orange', img: '/images/pending.png' };
  };


    /////////////////////////////////////////// DATA GRID SETUP START /////////////////////////////////////////////
    const scannerRows = data.map((item, index) => ({
      id: item._id || `doc-${index}`,
      ...item,
    }));

    const findDocumentIndex = (rowId) => data.findIndex((item) => (item._id || item.id) === rowId);

    const handleEditById = (rowId) => {
      const index = findDocumentIndex(rowId);
      if (index >= 0) {
        setEditingIndex(index);
        setEditableData({ ...data[index] });
        setEditDialogOpen(true);
      }
    };

    const handleDeleteById = (rowId) => {
      const index = findDocumentIndex(rowId);
      if (index >= 0) handleDelete(index);
    };

    const scannerColumns = [
      {
        field: 'storeName',
        headerName: 'Provider',
        flex: 1.1,
        minWidth: 160,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Typography variant="body2">{params.value}</Typography>
            {params.row.receiptImage && (
              <IconButton
                size="small"
                variant="outlined"
                onClick={() => {
                  setPreviewImage(params.row.receiptImage);
                  setPreviewOpen(true);
                }}
              >
                <ReceiptLongIcon/>
              </IconButton>
            )}
          </Box>
        ),
      },
      { field: 'category', headerName: 'Category', flex: 0.8, minWidth: 120 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 110,
        renderCell: (params) => {
          const statusInfo = checkDocumentStatus(params.value || 'pending');
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {statusInfo?.img && <img src={statusInfo.img} alt={params.value || 'pending'} style={{ margin: '8px 8px 8px 0' }} />}
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{params.value || 'pending'}</Typography>
            </Box>
          );
        },
      },
      { field: 'vatReg', headerName: 'VAT Reg', flex: 0.9, minWidth: 120 },
      { field: 'date', headerName: 'Date', flex: 0.8, minWidth: 110 },
      {
        field: 'vat',
        headerName: 'VAT',
        flex: 0.7,
        minWidth: 90,
        type: 'number',
        valueFormatter: (value) => {
          const amount = parseFloat(value ?? 0);
          return `€${amount.toFixed(2)}`;
        },
      },
      {
        field: 'total',
        headerName: 'Total',
        flex: 0.8,
        minWidth: 100,
        type: 'number',
        valueFormatter: (value) => {
          const amount = parseFloat(value ?? 0);
          return `€${amount.toFixed(2)}`;
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        flex: 1,
        minWidth: 240,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {isManager ? (
              <>
                <Button size="small" variant="contained" color="success" onClick={() => handleUpdateStatus(params.row._id, 'approved')}>Approve</Button>
                <Button size="small" variant="contained" color="error" onClick={() => handleUpdateStatus(params.row._id, 'declined')}>Decline</Button>
              </>
            ) : (
              <>
                <Button size="small" variant="outlined" color="primary" onClick={() => handleEditById(params.id)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteById(params.id)}>Delete</Button>
              </>
            )}
          </Box>
        ),
      },
    ];
    ////////////////////////////////////////////////////////// DataGrid END ///////////////////////////////////////////////


  return (
    <Box sx={{ flexGrow: 1 }}>
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
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)} sx={{ mr: 2 }}>
            <MenuIcon />
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
          <Typography sx={{ ml: 3, mr: 1, color: '#507b41' }}>
            Hello {session?.email ? session.email.split('@')[0] : 'User'}
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ ml: 1 }}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
          <Typography variant="h6" sx={{ m: 2 }}>Navigation</Typography>
          <Divider />
          <List>
            {session?.accType === 'Manager' ? (
              <ListItem disablePadding>
                <ListItemButton onClick={() => window.location.href = '/Accountant'}>
                  <ListItemIcon>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Accounts" />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={runShowScanner}>
                    <ListItemIcon>
                      <CameraAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Scan Document" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={runShowDocuments}>
                    <ListItemIcon>
                      <AddCircleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="Documents" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Scanner Page Box */ }
      {showScanner &&
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

                  <FormControl fullWidth margin='dense'>
                    <InputLabel id='category-label'>Category</InputLabel>
                    <Select
                      labelId='category-label'
                      value={ocrData.category ?? ''}
                      onChange={(e) =>
                        setOcrData({...ocrData, category: e.target.value})
                      }
                      label="Category"
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Cancel</Button>
              <Button type="submit" onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
          </Dialog>
          <Button onClick={handleFormOpen} variant="contained" color="primary" style={{backgroundColor: "Green"}}>Open Form Validation</Button>
          <br></br>
          Extracted Text:
          <div style={{width:'250px', objectFit: "contain"}} 
          label="Full Text"
          display="block"
          onChange={(e) => setOcrData({...ocrData, fullText: e.target.value})}
          >{ocrData.fullText}</div>
        </Box>
      }

      {/* Documents Page Box */ }
      {showDocuments &&
      <Box component="section" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          Documents
        </Typography>

        <Box sx={{ height: 460, width: '100%' }}>
          <DataGrid
            rows={scannerRows}
            columns={scannerColumns}
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            disableRowSelectionOnClick
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Box>

        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Receipt Image</DialogTitle>
          <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
            {previewImage ? <Box component="img" src={previewImage} alt="Receipt preview" sx={{ maxWidth: '100%', maxHeight: 600, objectFit: 'contain' }} /> : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Document</DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 1.5, pt: 1 }}>
            <TextField label="Provider" value={editableData.storeName || ''} onChange={(e) => setEditableData({ ...editableData, storeName: e.target.value })} />
            <TextField label="Category" value={editableData.category || ''} onChange={(e) => setEditableData({ ...editableData, category: e.target.value })} />
            <TextField label="VAT Reg" value={editableData.vatReg || ''} onChange={(e) => setEditableData({ ...editableData, vatReg: e.target.value })} />
            <TextField label="Date" value={editableData.date || ''} onChange={(e) => setEditableData({ ...editableData, date: e.target.value })} />
            <TextField label="VAT" value={editableData.vat || ''} onChange={(e) => setEditableData({ ...editableData, vat: e.target.value })} />
            <TextField label="Total" value={editableData.total || ''} onChange={(e) => setEditableData({ ...editableData, total: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Grand Total & VAT Sum */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '4fr 1fr',
          padding: '10px',
          borderTop: '2px solid black',
          fontWeight: 'bold',
          marginTop: '10px'
        }}>
          <div style={{ textAlign: "right" }}>Total VAT:</div>
          <div style={{ textAlign: "right" }}>{vatSum.toFixed(2)}</div>

          <div style={{ textAlign: "right" }}>Grand Total:</div>
          <div style={{ textAlign: "right" }}>{totalSum.toFixed(2)}</div>
        </div>
        <Button variant="contained" color="success" onClick={exportToCSV}>
        Export to CSV
        </Button>

      </Box>
      

      }
    </Box>
  );
}
