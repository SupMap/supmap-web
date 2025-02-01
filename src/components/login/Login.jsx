import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                loginUser: email,
                password: password
            });

            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (err) {
            setError("Email ou mot de passe incorrect");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center">
                <img src="MAP2-300.png" alt="Map" className="img-fluid mb-4 w-25"/>
            </div>

            <h2 className="text-center fw-bold mb-4 primaryColor">Bon retour parmi nous !</h2>

            {error && <p className="text-danger text-center">{error}</p>}

            <Form onSubmit={handleLogin}>
                <Form.Control
                    type="email"
                    placeholder="Entrez votre email"
                    className="mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Form.Control
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    className="mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" className="w-100 mb-3 secondaryButton">
                    Se connecter
                </Button>
            </Form>

            <a href="#" className="text-center d-block secondaryColor">Mot de passe oublié ?</a>
            <div className="mt-4 text-center ">
                <p>Vous ne possédez pas de compte ?</p>
                <a href='/register' className="primaryColor">Inscrivez-vous ici</a>
            </div>
        </div>
    );
}
