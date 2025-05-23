import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('Inicio');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setSidebarOpen(open);
  };

  const handleSidebarOption = (option) => {
    setOpcionSeleccionada(option);
    if (option === 'Inicio') {
      navigate('/');
    }
    if (option === 'Pendientes') {
      navigate('/pendientes');
    }
    if (option === 'Distrito 1') {
      navigate('/distritos', { state: { distrito: "distrito 1" } });
    }
    if (option === 'Distrito 2') {
      navigate('/distritos', { state: { distrito: "distrito 2" } });
    }
    if (option === 'Distrito 3') {
      navigate('/distritos', { state: { distrito: "distrito 3" } });
    }
    if (option === 'Distrito 4') {
      navigate('/distritos', { state: { distrito: "distrito 4" } });
    }
    if (option === 'Distrito 5') {
      navigate('/distritos', { state: { distrito: "distrito 5" } });
    }
    if (option === 'Distrito 6') {
      navigate('/distritos', { state: { distrito: "distrito 6" } });
    }


    setSidebarOpen(false);
  };


  const sidebarOptions = [
    { text: 'Inicio', icon: <HomeIcon /> },
    { text: 'Pendientes', icon: <PendingActionsIcon /> },
    // { text: 'Distrito 1', icon: <HomeIcon /> },
    // { text: 'Distrito 2', icon: <HomeIcon /> },
    // { text: 'Distrito 3', icon: <HomeIcon /> },
    // { text: 'Distrito 4', icon: <HomeIcon /> },
    // { text: 'Distrito 5', icon: <HomeIcon /> },
    // { text: 'Distrito 6', icon: <HomeIcon /> },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#019f84e6', boxShadow: 'none' }}>
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 500 }}>
            {opcionSeleccionada}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} sx={{ borderRadius: '50%' }}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleDrawer(false)}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#333',
            color: 'white',
            boxShadow: '4px 0px 6px rgba(0, 0, 0, 0.16)',
            transition: 'transform 0.3s ease',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
          }
        }}
      >
        <Box sx={{ width: '100%' }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <Typography variant="h6" sx={{ p: 2, textAlign: 'center', color: 'white' }}>{user.email}</Typography>
          <Divider sx={{ backgroundColor: '#019f84e6' }} />
          <List>
            {sidebarOptions.map((option) => (
              <ListItemButton button key={option.text} onClick={() => handleSidebarOption(option.text)} sx={{
                '&:hover': {
                  backgroundColor: '#019f84e6',
                  color: 'white'
                },
                padding: '10px 20px'
              }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.text} sx={{ color: 'white' }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
