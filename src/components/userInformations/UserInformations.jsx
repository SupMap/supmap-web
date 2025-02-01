import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function UserInformations({ handleClose }) {
    const [userInfos, setUserInfos] = useState(null)
    const [error, setError] = useState('');


    useEffect(() => {
        getUserInfos();
    }, []);

    async function getUserInfos() {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("Utilisateur non connecté.");

            const response = await axios.get('http://localhost:8080/api/user/info', {
                headers: { Authorization: `${token}` }
            });

            setUserInfos(response.data)
        } catch (err) {
            setError("Impossible de récupérer les informations utilisateur");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center">
                    <img src="MAP2-300.png" alt="Map" className="img-fluid mb-4 w-25"/>
                </div>

                <h2 className="text-center fw-bold mb-4 primaryColor">Mon Profil</h2>

                {error && <p className="text-danger text-center">{error}</p>}

                {userInfos ? (
                    <div className="text-center">
                        <p><strong>Nom:</strong> {userInfos.name} {userInfos.secondName}</p>
                        <p><strong>Username:</strong> {userInfos.username}</p>
                        <p><strong>Email:</strong> {userInfos.email}</p>
                    </div>
                ) : (
                    <p className="text-center">Chargement des informations...</p>
                )}

                <Button className="w-100 mt-3 secondaryButton" onClick={handleClose}>
                    Fermer
                </Button>
        </div>
    )
}