'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  useTheme,
  styled
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart } from '@mui/x-charts/PieChart';

const drawerWidth = 260;

export default function Accountant() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('documents');
  const [users, setUsers] = useState([]);
  const [managedAccounts, setManagedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [documents, setDocuments] = useState([]);
  const [fetchingDocs, setFetchingDocs] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch('/api/sessionHandling');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    loadSession();
    loadUsers();
  }, []);


  //////////////////////////////////////////////////////////////////////////////
  // Drawer stuff //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));


  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));


  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////  

  const handleLogout = async () => {
    try {
      await fetch('/api/sessionHandling', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    window.location.href = '/Login';
  };

  const handleAddAccount = async (username) => {
    if (!managedAccounts.includes(username)) {
      setManagedAccounts((prev) => [...prev, username]);
      setSelectedAccount(username);
      await fetchDocuments(username);
    }
  };

  const handleRemoveAccount = (username) => {
    setManagedAccounts((prev) => prev.filter((user) => user !== username));
    if (selectedAccount === username) {
      const remaining = managedAccounts.filter((user) => user !== username);
      setSelectedAccount(remaining[0] || '');
      if (remaining[0]) {
        fetchDocuments(remaining[0]);
      } else {
        setDocuments([]);
      }
    }
  };

  const fetchDocuments = async (username) => {
    if (!username) {
      setDocuments([]);
      return;
    }

    setFetchingDocs(true);
    try {
      const query = new URLSearchParams({ username });
      const response = await fetch(`/api/accDataRetrieval?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch documents for', username);
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setFetchingDocs(false);
    }
  };

  const handleAccountSelect = async (username) => {
    setSelectedAccount(username);
    await fetchDocuments(username);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch('/api/updateDocument', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setDocuments((prev) => prev.map((item) => item._id === id ? { ...item, status } : item));
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Failed to update document status.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (session?.accType !== 'Manager') {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access denied
        </Typography>
        <Typography>
          You must be a manager to access this page.
        </Typography>
        <Button variant="contained" sx={{ mt: 4 }} onClick={() => window.location.href = '/Login'}>
          Go to Login
        </Button>
      </Container>
    );
  }

  const checkDocumentStatus = (status) => {
    if (status === 'approved') return { color: 'green', img: '/images/approved.png' };
    if (status === 'declined') return { color: 'red', img: '/images/declined.png' };
    if (status === 'pending') return { color: 'orange', img: '/images/pending.png' };
  };

  // count how many different statuses there are in the documents list and store in an object like { approved: 3, declined: 2, pending: 5 }
  const statusCounts = documents.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {});

  const customerAccounts = users.filter((user) => user.accType === 'Customer');

  const accountantRows = documents.map((doc, index) => ({
    id: doc._id || `doc-${index}`,
    ...doc,
  }));

  const accountantColumns = [
    {
      field: 'storeName',
      headerName: 'Provider',
      flex: 1.1,
      minWidth: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <Typography variant="body2">{params.value}</Typography>
          {params.row.receiptImage && (
            <Button
              size="small"
              onClick={() => {
                setPreviewImage(params.row.receiptImage);
                setPreviewOpen(true);
              }}
            >
              <IconButton>
                  <ReceiptLongIcon/>
              </IconButton>
            </Button>
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
        return statusInfo?.img ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={statusInfo.img} alt={params.value || 'pending'} style={{ margin: '8px 8px 8px 0' }} />
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{params.value || 'pending'}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{params.value || 'pending'}</Typography>
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
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleUpdateStatus(params.row._id, 'approved')}>
            Approve
          </Button>
          <Button size="small" variant="contained" color="error" startIcon={<ClearIcon />} onClick={() => handleUpdateStatus(params.row._id, 'declined')}>
            Decline
          </Button>
        </Box>
      ),
    },
  ];

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
        }}
      >
        <Toolbar>
          <IconButton             
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              drawerOpen && { display: 'none' },
            ]}>
            <MenuIcon/>
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
            Hello {session?.email ? session.email.split('@')[0] : 'Manager'}
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ ml: 1 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}>
        <Box sx={{ width: 260 }} role="presentation">
          <DrawerHeader>
            <IconButton onClick={() => handleDrawerClose()}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setViewMode('documents')}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Documents" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setViewMode('analytics')}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setAccountsOpen((prev) => !prev)}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Add Account to Manage" />
              </ListItemButton>
            </ListItem>
          </List>
          <Main open={drawerOpen}/>
          {accountsOpen && (
            <Box sx={{ p: 2, maxHeight: 300, overflowY: 'auto' }}>
              {customerAccounts.length === 0 ? (
                <Typography variant="body2">No customer accounts found.</Typography>
              ) : (
                customerAccounts.map((user) => (
                  <Button
                    key={user._id}
                    fullWidth
                    size="small"
                    variant={managedAccounts.includes(user.username) ? 'outlined' : 'contained'}
                    sx={{ mb: 1, textTransform: 'none', fontSize: '0.85rem' }}
                    onClick={() => handleAddAccount(user.username)}
                  >
                    {managedAccounts.includes(user.username) ? `Managing ${user.username}` : `Manage ${user.username}`}
                  </Button>
                ))
              )}
            </Box>
          )}
        </Box>
      </Drawer>
      <Box sx={{ mt: 4, display: 'grid', gap: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Managed Accounts
          </Typography>
          {managedAccounts.length === 0 ? (
            <Typography>No accounts selected yet. Use the drawer to add accounts to manage.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {managedAccounts.map((username) => (
                <Chip
                  key={username}
                  label={username}
                  onClick={() => handleAccountSelect(username)}
                  onDelete={() => handleRemoveAccount(username)}
                />
              ))}
            </Box>
          )}
        </Box>

        {viewMode === 'documents' ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="manage-account-label">Selected Account</InputLabel>
              <Select
                labelId="manage-account-label"
                value={selectedAccount}
                label="Selected Account"
                onChange={(e) => handleAccountSelect(e.target.value)}
              >
                {managedAccounts.map((username) => (
                  <MenuItem key={username} value={username}>
                    {username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h6">
              Documents for {selectedAccount || 'N/A'}
            </Typography>
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle>Receipt Image</DialogTitle>
              <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                {previewImage ? <Box component="img" src={previewImage} alt="Receipt preview" sx={{ maxWidth: '100%', maxHeight: 600, objectFit: 'contain' }} /> : null}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPreviewOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            {fetchingDocs ? (
              <CircularProgress />
            ) : (
              <Box sx={{ height: 460, width: '100%' }}>
                <DataGrid
                  rows={accountantRows}
                  columns={accountantColumns}
                  pageSizeOptions={[5, 10]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                  disableRowSelectionOnClick
                  sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box component="section" sx={{ p: 1, border: '1px dashed grey' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Document Analytics Overview
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: statusCounts.declined || 0, label: 'Declined' },
                        { id: 1, value: statusCounts.approved || 0, label: 'Approved' },
                        { id: 2, value: statusCounts.pending || 0, label: 'Pending' },
                      ],
                    },
                  ]}
                  width={400}
                  height={250}
                  margin={{ top: 50, bottom: 50, left: 50, right: 125 }}
                  colors={['#f44336', '#4caf50', '#ff9800']}
                />
              </Box>
              </Box>    
            </Box>
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Summary:</strong>
              </Typography>
              <Typography variant="body2">
                Total Documents: {documents.length}
              </Typography>
              <Typography variant="body2" color="success.main">
                Approved: {statusCounts.approved || 0}
              </Typography>
              <Typography variant="body2" color="error.main">
                Declined: {statusCounts.declined || 0}
              </Typography>
              <Typography variant="body2" color="warning.main">
                Pending: {statusCounts.pending || 0}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
  </Box>
  );
}
