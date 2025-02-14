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

    
    const toggleLoginModal = () => {
        setShowLoginModal(!showLoginModal);
        if (!showLoginModal) setShowRegisterModal(false); 
    };

    const toggleRegisterModal = () => {
        setShowRegisterModal(!showRegisterModal);
        if (!showRegisterModal) setShowLoginModal(false); 
    };

    
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <div
            className="position-fixed top-0 end-0 p-2"
            style={{
                zIndex: 2000,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "10px",
            }}
        >
            {isAuthenticated ? (
                <>
                    <Button
                        style={{
                            backgroundColor: "#4A47A3",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                        }}
                        onClick={() => setShowUserInfoModal(true)}
                    >
                        Profil utilisateur
                    </Button>

                    <Button
                        style={{
                            backgroundColor: "#D9534F",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                        }}
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        style={{
                            backgroundColor: showLoginModal ? "#6c757d" : "#3B2D86",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            opacity: showLoginModal ? 0.7 : 1,
                        }}
                        onClick={toggleRegisterModal}
                        disabled={showLoginModal}
                    >
                        S'inscrire
                    </Button>

                    <Button
                        style={{
                            backgroundColor: showRegisterModal ? "#6c757d" : "#E74C3C",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            opacity: showRegisterModal ? 0.7 : 1,
                        }}
                        onClick={toggleLoginModal}
                        disabled={showRegisterModal}
                    >
                        Se connecter
                    </Button>
                </>
            )}

            {/* Modal Connexion */}
            <Modal show={showLoginModal} onHide={toggleLoginModal} centered>
                <Modal.Body>
                    <Login toggleRegisterModal={toggleRegisterModal} />
                </Modal.Body>
            </Modal>

            {/* Modal Inscription */}
            <Modal show={showRegisterModal} onHide={toggleRegisterModal} centered>
                <Modal.Body>
                    <Register toggleLoginModal={toggleLoginModal} />
                </Modal.Body>
            </Modal>

            {/* Modal Profil Utilisateur */}
            <Modal show={showUserInfoModal} onHide={() => setShowUserInfoModal(false)} centered>
                <Modal.Body>
                    <UserInformations handleClose={() => setShowUserInfoModal(false)} />
                </Modal.Body>
            </Modal>
        </div>
    );
}
