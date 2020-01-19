import React, { useState, useEffect } from 'react';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import api from './services/api';

import './App.css';
import './Sidebar.css';
import './Main.css';

export default function App() {
    const [devs, setDevs] = useState([]);

    useEffect(function() {
        loadDevs();
    }, []);

    async function handleAddDev(data) {
        const response = await api.post('/devs', data);
        setDevs([...devs, response.data]);
    }

    async function loadDevs() {
        const { data } = await api.get('/devs');
        setDevs(data);
    }

    return (
        <div id="app">
            <DevForm onSubmit={handleAddDev} />
            <main>
                <ul>
                    {devs.map(dev => <DevItem key={dev._id} dev={dev} />)}
                </ul>
            </main>
        </div>
    );
}
