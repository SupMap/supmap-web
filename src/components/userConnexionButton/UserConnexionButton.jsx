import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from '../login/Login';
import Register from '../register/Register';

export default function UserConnexionButton() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    function toggleLoginModal() {
        setShowLoginModal(!showLoginModal);
    };

    function toggleRegisterModal() {
        setShowRegisterModal(!showRegisterModal);
    };

    return (
        <div className="position-fixed top-0 end-0 p-2" style={{ zIndex: 2000 }}>

            <div className="d-flex justify-content-center gap-2">
                <Button
                    className="w-auto d-flex justify-content-center primaryButton"
                    onClick={toggleRegisterModal}
                    disabled={showLoginModal}>
                    S'inscrire
                </Button>

                <Button
                    className="w-auto d-flex justify-content-center secondaryButton"
                    onClick={toggleLoginModal}
                    disabled={showRegisterModal}>
                    Se connecter
                </Button>
            </div>

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