import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";
import axios from "axios";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [graphhopperData, setGraphhopperData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incidents, setIncidents] = useState([]);

    async function handleNavigationStart(start, destination, travelMode) {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/directions?origin=${start}&destination=${destination}&mode=${travelMode}`, { headers: { Authorization: `${token}` } });
            if (response.data) {
                console.log("Itinéraire récupéré :", response.data);
                setGraphhopperData(response.data);
            } else {
                throw new Error("Itinéraire non trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de l'obtention de l'itinéraire :", error);
        }
    }

    async function simulateAccident() {
        try {
            const token = localStorage.getItem("token");
            const incidentData = {
                typeId: 1,
                latitude: 47.41955562253292,
                longitude: 0.7047407431631431
                // longitude: 47.41955562253292,
                // latitude: 0.7047407431631431
            };
            const response = await axios.post("http://localhost:8080/api/incidents", incidentData, {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log("Incident créé :", response.data);
        } catch (error) {
            console.error("Erreur lors de la création de l'incident :", error);
        }
    }

    async function fetchIncidents() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/incidents", { headers: { Authorization: `${token}` } });
            if (response.data) {
                setIncidents(response.data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des incidents :", error);
        }
    }

    // Récupérer les incidents au chargement
    useEffect(() => {
        fetchIncidents();
    }, []);

    return (
        <div>
            <UserConnexionButton setIsModalOpen={setIsModalOpen} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 3000 }}>
                <button onClick={simulateAccident}>Simuler Accident</button>
            </div>
            {!isModalOpen && <RoutePlanner onStartNavigation={handleNavigationStart} />}
            <div className="map">
                <Map graphhopperResponse={graphhopperData} incidents={incidents} />
            </div>
        </div>
    );
}
