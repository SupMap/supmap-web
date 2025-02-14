import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function Register({ toggleLoginModal }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                email,
                password,
                name,
                secondName
            });

            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (err) {
            setError("Un compte existe déjà avec cet email ou username");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center">
                <img src="MAP2-300.png" alt="Map" className="img-fluid mb-4 w-25"/>
            </div>

            <h2 className="text-center fw-bold mb-4 primaryColor">Bienvenue parmi nous!</h2>

            {error && <p className="text-danger text-center">{error}</p>}

            <Form onSubmit={handleRegister}>
                <Form.Control
                    type="text"
                    placeholder="Nom d'utilisateur"
                    className="mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Form.Control
                    type="text"
                    placeholder="Prénom"
                    className="mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Form.Control
                    type="text"
                    placeholder="Nom"
                    className="mb-3"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />

                <Form.Control
                    type="email"
                    placeholder="Email"
                    className="mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    className="mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" className="w-100 mb-3 secondaryButton">
                    S'inscrire
                </Button>
            </Form>

            <div className="mt-4 text-center">
                <p>Vous possédez déjà un compte ?</p>
                <span 
                    onClick={toggleLoginModal} 
                    className="primaryColor fw-bold cursor-pointer"
                    style={{ cursor: "pointer" }}
                >
                    Connectez-vous ici
                </span>
            </div>
        </div>
    );
}
