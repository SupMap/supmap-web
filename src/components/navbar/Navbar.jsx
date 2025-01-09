import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function MyNavbar() {
    return (
        <Navbar style={{ backgroundColor: 'transparent', height: '4.5rem' }}>
            <Container>
                <Navbar.Brand href="/" className='text-white'><img src='./MAP2-Blanc.png' alt="Logo"
                    style={{ height: '100%', maxHeight: '4.2rem', width: 'auto' }}
                /></Navbar.Brand>

                <Nav className="ms-auto">
                    <Button variant="outline-primary" href="/login" className="me-2 text text-white">Connexion</Button>
                    <Button variant="primary" href="/register">S'enregistrer</Button>
                </Nav>
            </Container>
        </Navbar>
    );
};
