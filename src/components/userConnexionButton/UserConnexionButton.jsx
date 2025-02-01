import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from '../login/Login';
import Register from '../register/Register';
import UserInformations from '../userInformations/UserInformations';

export default function UserConnexionButton() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    function toggleLoginModal() {
        setShowLoginModal(!showLoginModal);
    };

    function toggleRegisterModal() {
        setShowRegisterModal(!showRegisterModal);
    };

    function handleLogout() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

    return (
        <div className="position-fixed top-0 end-0 p-2" style={{ zIndex: 2000 }}>
            <div className="d-flex justify-content-center gap-2">
                {isAuthenticated ? (
                    <>
                        <Button className="w-auto d-flex justify-content-center primaryButton"
                            onClick={() => setShowUserInfoModal(true)}
                        >
                            Profil utilisateur
                        </Button>

                        <Button className="w-auto d-flex justify-content-center secondaryButton"
                            onClick={handleLogout}>
                            Déconnexion
                        </Button>
                    </>
                ) : (
                    <>
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
                    </>
                )
                }
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

            <Modal show={showUserInfoModal} onHide={() => setShowUserInfoModal(false)} centered>
                <Modal.Body>
                    <UserInformations handleClose={() => setShowUserInfoModal(false)} />
                </Modal.Body>
            </Modal>
        </div>
    );
}