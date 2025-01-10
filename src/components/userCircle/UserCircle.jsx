import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from '../login/Login';  
import Register from '../register/Register';

export default function UserCircle() {
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    function toggleModal() {
        setShowModal(!showModal);
    };

    function toggleLoginModal() {
        setShowModal(false); 
        setShowLoginModal(!showLoginModal);
    };

    function toggleRegisterModal() {
        setShowModal(false); 
        setShowRegisterModal(!showRegisterModal);
    };

    return (
        <div className="position-fixed top-0 end-0 p-2" style={{ zIndex: 2000 }}>
            <i
                className="bi bi-person-circle"
                style={{ cursor: 'pointer', fontSize: '3.5rem', color: '#3d2683' }}
                onClick={toggleModal}>
            </i>

            {/* Modale initiale du UserCircle */}
            <Modal show={showModal} onHide={toggleModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Bienvenue !</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Button variant="primary" className="m-2" onClick={toggleLoginModal}>Se connecter</Button>
                    <Button variant="outline-primary" className="m-2" onClick={toggleRegisterModal}>S'inscrire</Button>
                </Modal.Body>
            </Modal>

            {/* Modale pour le Login */}
            <Modal show={showLoginModal} onHide={toggleLoginModal} centered>
                <Modal.Body>
                    <Login /> 
                </Modal.Body>
            </Modal>

            <Modal show={showRegisterModal} onHide={toggleRegisterModal} centered>
                <Modal.Body>
                    <Register /> 
                </Modal.Body>
            </Modal>
        </div>
    );
}
