import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { FaUser, FaEnvelope, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';

export default function UserInformations({ handleClose }) {
    const [userInfos, setUserInfos] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getUserInfos();
    }, []);

    async function getUserInfos() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Utilisateur non connecté.");

            const response = await axios.get('http://localhost:8080/api/user/info', {
                headers: { Authorization: `${token}` }
            });

            setUserInfos(response.data);
        } catch (err) {
            setError("Impossible de récupérer les informations utilisateur");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center">
                <img src="MAP2-300.png" alt="Map" className="img-fluid mb-4 w-25" />
            </div>

            <h2 className="text-center fw-bold mb-4 primaryColor">Mon Profil</h2>

            {error && <p className="text-danger text-center">{error}</p>}

            {userInfos ? (
                <div className="px-3">
                    <div className="d-flex align-items-center mb-2">
                        <FaUser className="me-2" style={{ color: 'var(--secondaryColor)' }} />
                        <strong className="me-2">Nom :</strong>
                        <span>{userInfos.name} {userInfos.secondName}</span>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                        <FaUserShield className="me-2" style={{ color: 'var(--secondaryColor)' }} />
                        <strong className="me-2">Username :</strong>
                        <span>{userInfos.username}</span>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                        <FaEnvelope className="me-2" style={{ color: 'var(--secondaryColor)' }} />
                        <strong className="me-2">Email :</strong>
                        <span>{userInfos.email}</span>
                    </div>

                    <div className="p-3 bg-light border rounded w-100 text-center mb-3">
                        <FaExclamationTriangle className="mb-2 fs-4  text-warning rounded p-1" />
                        <h5 className="mb-1 mt-2">Signalements ce mois-ci :</h5>
                        <div className="fs-4 fw-bold">{userInfos.monthlyReports || 0}</div>
                    </div>
                </div>
            ) : (
                <p className="text-center">Chargement des informations...</p>
            )}

            <Button className="w-100 mt-3 secondaryButton" onClick={handleClose}>
                Fermer
            </Button>
        </div>
    );
}
