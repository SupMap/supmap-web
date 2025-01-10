import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UserCircle from '../userCircle/UserCircle'; // Import du composant

export default function MyNavbar() {
    return (
        <Navbar style={{ backgroundColor: 'transparent', height: '4.5rem' }}>
            <Container>
                {/* Logo de la Navbar */}
                <Navbar.Brand href="/" className='text-white'>
                    <img src='./MAP2-Blanc.png' alt="Logo"
                        style={{ height: '100%', maxHeight: '4.2rem', width: 'auto' }}
                    />
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}
