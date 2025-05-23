// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
    /*BarChart, Bar, XAxis, YAxis, CartesianGrid,*/ Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorIcon from '@mui/icons-material/Error';
import { useAuth } from '../AuthContext';
import './DashBoard.css';

const Dashboard = () => {
    const { url } = useAuth();
    const [data, setData] = useState({
        total_registros: 0,
        total_distritos: 0,
        total_contactados: 0,
        pendientes_por_llamar: 0,
        pendientes_confirmados: 0,
        datos_incorrectos: 0
    });
    // const [dataGraf, setDataGraf] = useState([]);
    const [dataGrafPie, setDataGrafPie] = useState([]);
    const COLORS = ['#8884d8', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#607d8b', '#00bcd4'];
    useEffect(() => {
        fetch(url + '/api/getIndicadores')
            .then(res => res.json())
            .then(data => setData(data[0]));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetch(url + '/api/getDataGarf') // reemplaza con tu ruta real
            .then(res => res.json())
            .then(json => {
                console.log('Datos recibidos:', json);
                // setDataGraf(json); // debe ser un array de objetos
            })

            .catch(err => console.error(err));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetch(url + '/api/getDataGarfPie')
            .then(res => res.json())
            .then(json => {
                const pieData = json.map(item => ({
                    name: item.name,
                    value: Number(item.value)
                }));
                setDataGrafPie(pieData);
            })
            .catch(err => console.error(err));
        // eslint-disable-next-line
    }, []);


    const cards = [
        {
            label: 'Total de Registros',
            value: data.total_registros,
            icon: <PeopleIcon fontSize="medium" color="primary" />
        },
        // {
        //     label: 'Total de Distritos',
        //     value: data.total_distritos,
        //     icon: <ApartmentIcon fontSize="medium" color="success" />
        // },
        {
            label: 'Contactados',
            value: data.total_contactados,
            icon: <ContactPhoneIcon fontSize="medium" color="info" />
        },
        {
            label: 'Pendientes por Llamar',
            value: data.pendientes_por_llamar,
            icon: <PhoneMissedIcon fontSize="medium" color="warning" />
        },
        {
            label: 'Datos incorrectos',
            value: data.datos_incorrectos,
            icon: <ErrorIcon fontSize="medium" color="warning" />
        },
        {
            label: 'Verificados',
            value: data.pendientes_confirmados,
            icon: <VerifiedUserIcon fontSize="medium" color="secondary" />
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="card-scroll">
                {cards.map((card, index) => (
                    <Card className="dashboard-card" key={index}>
                        <div className="icon-wrapper">{card.icon}</div>
                        <CardContent className="card-content">
                            <Typography variant="subtitle2" color="textSecondary">
                                {card.label}
                            </Typography>
                            <Typography variant="h6">{card.value}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="graficas-container">
                {/* <div className="grafica-box">
                    <h3 style={{ textAlign: 'center', marginTop: '1em' }}>Estatus por Distrito</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataGraf} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="distrito" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="por_llamar" stackId="a" fill="#8884d8" name="Por llamar" />
                            <Bar dataKey="verificado" stackId="a" fill="#4caf50" name="Verificado" />
                            <Bar dataKey="no_contesta" stackId="a" fill="#ff9800" name="No contesta" />
                            <Bar dataKey="datos_incorrectos" stackId="a" fill="#9c27b0" name="Datos incorrectos" />
                            <Bar dataKey="invitado" stackId="a" fill="#607d8b" name="Invitado" />
                        </BarChart>
                    </ResponsiveContainer>
                </div> */}

                <div className="grafica-box">
                    <h3 style={{ textAlign: 'center' }}>Distribución de Estatus</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataGrafPie}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {dataGrafPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>


        </div>
    );
};

export default Dashboard;
