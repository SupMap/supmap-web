import React, { useEffect, useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import Login from '../login/Login';
import Register from '../register/Register';
import UserInformations from '../userInformations/UserInformations';

export default function UserConnexionButton({ setIsModalOpen }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
    const [modalState, setModalState] = useState({
        login: false,
        register: false,
        userInfo: false
    });

    useEffect(() => {
        async function verifyToken() {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await axios.get('http://localhost:8080/api/user/info', {
                        headers: { Authorization: `${token}` }
                    });
                } catch (err) {
                    console.error("Token invalide ou expiré :", err);
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                }
            }
        }

        verifyToken();

        setIsAuthenticated(!!localStorage.getItem("token"));

        function updateAuthState() {
            setIsAuthenticated(!!localStorage.getItem("token"));
        }

        window.addEventListener("storage", updateAuthState);

        return () => {
            window.removeEventListener("storage", updateAuthState);
        };
    }, []);

    function handleModal(modal, state) {
        setModalState({ login: false, register: false, userInfo: false, [modal]: state });
        setIsModalOpen(state);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

    return (
        <Container fluid className="position-fixed top-0 end-0 p-2 d-flex flex-row justify-content-end gap-2" style={{ zIndex: 2000 }}>
            {isAuthenticated ? (
                <>
                    <Button className="btn fw-bold primaryButton" onClick={() => handleModal('userInfo', true)}>
                        Profil utilisateur
                    </Button>
                    <Button className="btn btn-danger fw-bold secondaryButton" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        className="btn fw-bold primaryButton"
                        onClick={() => handleModal('register', true)}
                        disabled={modalState.login}
                    >
                        S'inscrire
                    </Button>
                    <Button
                        className="btn fw-bold secondaryButton"
                        onClick={() => handleModal('login', true)}
                        disabled={modalState.register}
                    >
                        Se connecter
                    </Button>
                </>
            )}

            <Modal show={modalState.login} onHide={() => handleModal('login', false)} centered>
                <Modal.Body>
                    <Login toggleRegisterModal={() => handleModal('register', true)} />
                </Modal.Body>
            </Modal>

            <Modal show={modalState.register} onHide={() => handleModal('register', false)} centered>
                <Modal.Body>
                    <Register toggleLoginModal={() => handleModal('login', true)} />
                </Modal.Body>
            </Modal>

            <Modal show={modalState.userInfo} onHide={() => handleModal('userInfo', false)} centered>
                <Modal.Body>
                    <UserInformations handleClose={() => handleModal('userInfo', false)} />
                </Modal.Body>
            </Modal>
        </Container>
    );
}
