import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";
import axios from "axios";
import { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

export default function HomePage() {
    const [graphhopperData, setGraphhopperData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey,
        libraries: ['places']
    });

    async function handleNavigationStart(start, destination, travelMode) {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/directions?origin=${start}&destination=${destination}&mode=${travelMode}`, {
                headers: { Authorization: `${token}` }
            });
            if (response.data) setGraphhopperData(response.data);
            else throw new Error("Itinéraire non trouvé.");
        } catch (error) {
            console.error("Erreur lors de l'obtention de l'itinéraire :", error);
        }
    }

    async function simulateAccident() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:8080/api/incidents", {
                typeId: 1,
                latitude: 47.41955562253292,
                longitude: 0.7047407431631431
            }, {
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
            const response = await axios.get("http://localhost:8080/api/incidents", {
                headers: { Authorization: `${token}` }
            });
            if (response.data) setIncidents(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des incidents :", error);
        }
    }

    useEffect(() => { fetchIncidents(); }, []);

   
    if (!isLoaded) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <p style={{  fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'}}>
                Chargement de la carte en cours...
            </p>
                <img src="/MAP2-300.png" alt="Chargement..." style={{ maxWidth: "300px" }} />
            </div>
        );
    }

    return (
        <div>
            <UserConnexionButton setIsModalOpen={setIsModalOpen} />
            {/* <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 3000 }}>
                <button onClick={simulateAccident}>Simuler Accident</button>
            </div> */}
            {!isModalOpen && <RoutePlanner onStartNavigation={handleNavigationStart} />}
            <div className="map">
                <Map graphhopperResponse={graphhopperData} incidents={incidents} />
            </div>
        </div>
    );
}
