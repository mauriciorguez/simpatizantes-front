import React, { useState, useEffect, useRef } from 'react';
import {
  Tabs, Tab, Box, Typography, List, ListItem, ListItemText, CircularProgress,
  IconButton, TextField, Divider, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAuth } from '../AuthContext';
import ErrorIcon from '@mui/icons-material/Error';

const estatusOptions = [
  'Invitado',
  'No contesta',
  'Datos incorrectos',
  'Sin whatsApp',
  'Verificado'
];

export default function EstatusTabs() {
  const { user, url } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [estatus, setEstatus] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [tipoContacto, setTipoContacto] = useState('');
  const mounted = useRef(false);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  const [cache, setCache] = useState({});
  const [mensajeError, setMensajeError] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const fetchRegistros = async (estatus) => {
    if (cache[estatus]) {
      setRegistros(cache[estatus]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${url}/api/call-pendientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_responsable: user.email, estatus })
      });

      if (!response.ok) throw new Error('Error al obtener los datos');
      const data = await response.json();
      setRegistros(data);
      setCache(prev => ({ ...prev, [estatus]: data }));
    } catch (error) {
      console.error('Error:', error);
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchRegistros(estatusOptions[selectedTab]);

    return () => mounted.current = false;
    // eslint-disable-next-line
  }, [selectedTab]);

  const handleCallClick = (contact) => {
    window.location.href = `tel:${contact.cel}`;
    setSelectedContact(contact);
    setEstatus('');
    setTipoContacto('');
    setObservaciones('');
    setTimeout(() => {
      if (mounted.current) {
        setOpenDialog(true);
      }
    }, 2000);
  };

  const handleWhatsApp = (contact) => {
    setSelectedContact(contact);
    setEstatus('');
    setTipoContacto('');
    setObservaciones('');
    const phoneNumber = contact.cel;
    const message = '¡Hola, excelente día!, no olvides votar en estas elecciones, te recordamos que tienes hasta las 6 de la tarde para ir a votar, te recomendamos que acudas antes para asegurar que puedas votar por un mejor Durango.';  // Mensaje predeterminado
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
    setTimeout(() => {
      if (mounted.current) {
        setOpenDialog(true);
      }
    }, 2000);
  };

  const handleForm = (contact) => {
    setSelectedContact(contact);
    setEstatus('');
    setTipoContacto('');
    setObservaciones('');
    setOpenDialog(true);
  };

  const handleGuardar = () => {
    if (!estatus) {
      setMensaje(true)
      setMensajeError('El estatus no puede estar vacío.')
      setTimeout(() => {
        setMensaje(false);
        setMensajeError("");
      }, 3000);

      return;
    }
    if (!tipoContacto) {
      setMensaje(true)
      setMensajeError('El campo tipo contacto no puede estar vacío.')
      setTimeout(() => {
        setMensaje(false);
        setMensajeError("");
      }, 3000);
      return;
    }

    const id_2 = selectedContact.id_2;
    const tipo_contacto = tipoContacto
    fetch(url + '/api/updateCallDgo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estatus, id_2, observaciones, tipo_contacto })
    })
      .then(response => response.json())
      .then(data => {
        setMensajeGuardado(true);
        setTimeout(() => setMensajeGuardado(false), 3000);
        const prevEstatus = estatusOptions[selectedTab];
        setCache(prevCache => {
          const newPrevList = (prevCache[prevEstatus] || []).filter(item => item.id_2 !== id_2);
          const newNextList = [...(prevCache[estatus] || []), { ...selectedContact, estatus }];

          return {
            ...prevCache,
            [prevEstatus]: newPrevList,
            [estatus]: newNextList
          };
        });
        const currentTabLabel = estatusOptions[selectedTab];
        if (currentTabLabel === prevEstatus) {
          setRegistros(prev => prev.filter(item => item.id_2 !== id_2));
        } else if (currentTabLabel === estatus) {
          setRegistros(prev => [...prev, { ...selectedContact, estatus }]);
        }
      })
      .catch(error => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos');
      })
      .finally(() => setOpenDialog(false));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="estatus tabs"
      >
        {estatusOptions.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="Buscar por nombre o teléfono"
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={1}>
          <List>
            {registros.filter(item =>
              item.nombre_c?.toLowerCase().includes(busqueda.toLowerCase()) ||
              item.cel?.includes(busqueda)
            ).length > 0 ? (
              registros
                .filter(item =>
                  item.nombre_c?.toLowerCase().includes(busqueda.toLowerCase()) ||
                  item.cel?.includes(busqueda)
                )
                .map((item) => (

                  <React.Fragment key={item.id_2}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            color="primary"
                            onClick={() => handleCallClick(item)}
                          >
                            <PhoneIcon sx={{ fontSize: "30px", marginRight: "5px" }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            color="success"
                            onClick={() => handleWhatsApp(item)}
                          >
                            <WhatsAppIcon sx={{ fontSize: "30px", marginRight: "5px" }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleForm(item)}
                          >
                            <DescriptionIcon color="secondary" sx={{ fontSize: "30px", marginRight: "5px" }} />
                          </IconButton>
                        </Box>
                      }
                    >
                      <Box sx={{ width: "200px" }}>
                        <ListItemText
                          primary={item.nombre_c}
                          secondary={
                            <>
                              <span>{`Cel: ${item.cel}`}</span><br />
                              <span>{item.distrito}</span><br />
                              <span>{`Llamadas: ${item.total_llamadas} | WhatsApp: ${item.total_whatsapp}`}</span><br />
                            </>
                          }
                        />
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60vh',
                  textAlign: 'center',
                  px: 2,
                }}
              >
                <DescriptionIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No se encontraron registros
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Formulario de seguimiento</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estatus</InputLabel>
            <Select value={estatus} onChange={(e) => setEstatus(e.target.value)} label="Estatus">
              {estatusOptions.map((option, idx) => (
                <MenuItem key={idx} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>¿Cómo se contacto?</InputLabel>
            <Select value={tipoContacto} onChange={(e) => setTipoContacto(e.target.value)} label="Tipo Contacto">
              <MenuItem value="Llamada">Llamada</MenuItem>
              <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              multiline
              rows={4}
              variant="outlined"
            />
          </FormControl>

        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
      {mensajeGuardado && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4caf50',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 9999,
            fontWeight: 'bold',
          }}
        >
          Datos guardados correctamente
        </Box>
      )}
      {mensaje && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#f44336',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 9999,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ErrorIcon sx={{ fontSize: 20 }} />
          {mensajeError}
        </Box>
      )}
    </Box>
  );
}
