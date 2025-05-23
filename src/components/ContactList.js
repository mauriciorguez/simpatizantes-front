import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAuth } from '../AuthContext';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ErrorIcon from '@mui/icons-material/Error';

export default function ContactList() {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState([]);
  const { user, url } = useAuth();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [estatus, setEstatus] = useState('');
  const [tipoContacto, setTipoContacto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const mounted = useRef(false);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const fetchCallPorUsuario = async () => {
    setLoading(true);
    const usuario_responsable = user.email;
    try {
      const response = await fetch(url + '/api/call-por-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_responsable }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los datos');
      }

      const data = await response.json();
      console.log(data)
      setContacts(data);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    mounted.current = true;
    fetchCallPorUsuario();
    return () => mounted.current = false;
    // eslint-disable-next-line
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.nombre_c?.toLowerCase().includes(search.toLowerCase())
  );

  const handleForm = (contact) => {
    console.log(contact)
    setSelectedContact(contact);
    setEstatus('');
    setTipoContacto('');
    setObservaciones('');
    if (mounted.current) {
      setOpenDialog(true);
    }
  };

  const handleGuardar = () => {
    if (!selectedContact) {
      console.error('No se ha seleccionado un contacto.');
      return;
    }
    const id_2 = selectedContact.id_2;
    const tipo_contacto = tipoContacto;
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
    setOpenDialog(false);
    fetch(url + '/api/updateCallDgo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estatus, id_2, observaciones, tipo_contacto }),
    })
      .then(response => response.json())
      .then(data => {
        setMensajeGuardado(true);
        setTimeout(() => setMensajeGuardado(false), 3000);
        fetchCallPorUsuario();

      })
      .catch(error => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos');
      });
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && contacts.length === 0) {
    return (
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
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="Buscar contacto"
        variant="outlined"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper elevation={1}>
        <List>
          {filteredContacts.map(contact => (
            <React.Fragment key={contact.id_2}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleCallClick(contact)}
                    >
                      <PhoneIcon
                        sx={{ fontSize: "30px", marginRight: "5px" }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="success"
                      onClick={() => handleWhatsApp(contact)}
                    >
                      <WhatsAppIcon sx={{ fontSize: "30px", marginRight: "5px" }} />
                    </IconButton>
                    <IconButton edge="end"
                      onClick={() => handleForm(contact)}>
                      <DescriptionIcon color="secondary" sx={{ fontSize: "30px" }} />
                    </IconButton>
                  </Box>
                }
              >
                <Box sx={{ width: "200px" }}>
                  <ListItemText
                    primary={contact.nombre_c}
                    secondary={
                      <>
                        <span>Cel: {contact.cel}</span><br />
                        <span>{contact.distrito}</span>
                      </>
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          setOpenDialog(false);
        }}
      >

        <DialogTitle>Formulario de seguimiento</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estatus</InputLabel>
            <Select value={estatus} onChange={(e) => setEstatus(e.target.value)} label="Estatus">
              <MenuItem value="Invitado">Invitado</MenuItem>
              <MenuItem value="No contesta">No contesta</MenuItem>
              <MenuItem value="Sin whatsApp">Sin whatsApp</MenuItem>
              <MenuItem value="Verificado">Verificado</MenuItem>
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
