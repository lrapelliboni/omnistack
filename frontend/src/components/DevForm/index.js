import React, { useState, useEffect } from 'react';

export default ({ onSubmit }) => {
    const [github_username, setGithubUsername] = useState('');
    const [techs, setTechs] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');

    useEffect(function() {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { longitude: long, latitude: lat } = position.coords;
                setLongitude(long);
                setLatitude(lat);
            },
            err => console.log(err),
            { enableHighAccuracy: true, timeout: 30000 }
        );
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        await onSubmit({
            github_username,
            techs,
            longitude,
            latitude
        });

        setGithubUsername('');
        setTechs('');
    }

    return (
        <aside>
            <strong>Cadastrar</strong>

            <form onSubmit={handleSubmit}>
                <div className="input-block">
                    <label htmlFor="github_username">Usuário do GitHub</label>
                    <input
                        value={github_username}
                        onChange={e => setGithubUsername(e.target.value)}
                        type="text"
                        name="login"
                        id="login"
                        required
                    />
                </div>

                <div className="input-block">
                    <label htmlFor="techs">Tecnologias</label>
                    <input
                        value={techs}
                        onChange={e => setTechs(e.target.value)}
                        type="text"
                        name="techs"
                        id="techs"
                        required
                    />
                </div>

                <div className="input-group">
                    <div className="input-block">
                        <label htmlFor="longitude">Longitude</label>
                        <input
                            value={longitude}
                            onChange={e => setLongitude(e.target.value)}
                            type="text"
                            name="longitude"
                            id="longitude"
                            required
                        />
                    </div>

                    <div className="input-block">
                        <label htmlFor="latitude">Latitude</label>
                        <input
                            value={latitude}
                            onChange={e => setLatitude(e.target.value)}
                            type="text"
                            name="latitude"
                            id="latitude"
                            required
                        />
                    </div>
                </div>

                <button type="submit">Salvar</button>
            </form>
        </aside>
    );
}
