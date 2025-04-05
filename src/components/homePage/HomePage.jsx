import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";
import axios from "axios";
import { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ['places'];

export default function HomePage() {
    const [graphhopperData, setGraphhopperData] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey,
        libraries
    });

    async function handleNavigationStart(start, destination, travelMode) {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/directions?origin=${start}&destination=${destination}&mode=${travelMode}`, {
                headers: { Authorization: `${token}` }
            });

            console.log("Réponse brute de l'API :", response.data);

            const fastestRaw = response.data.fastest;
            const noTollRaw = response.data.noToll;
            const economicalRaw = response.data.economical;

            if (fastestRaw && noTollRaw && economicalRaw) {
                const parsed = {
                    fastest: typeof fastestRaw === 'string' ? JSON.parse(fastestRaw) : fastestRaw,
                    noToll: typeof noTollRaw === 'string' ? JSON.parse(noTollRaw) : noTollRaw,
                    economical: typeof economicalRaw === 'string' ? JSON.parse(economicalRaw) : economicalRaw
                };

                const newRoutes = [
                    { label: "Meilleur itin.", data: parsed.fastest },
                    { label: "Sans péage", data: parsed.noToll },
                    { label: "Économique", data: parsed.economical }
                ];
                console.log("Itinéraires reçus :", newRoutes);
                setRoutes(newRoutes);
                setGraphhopperData(parsed.fastest);
            } else if (response.data?.paths) {
                const route = { label: "Meilleur itin.", data: response.data };
                setRoutes([route]);
                setGraphhopperData(response.data);
            } else {
                console.error("Réponse inattendue de l'API :", response.data);
            }
        } catch (error) {
            console.error("Erreur lors de l'obtention de l'itinéraire :", error);
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

    useEffect(() => {
        fetchIncidents();
    }, []);

    useEffect(() => {
        console.log("Itinéraires à afficher :", routes);
    }, [routes]);

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
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    Chargement de la carte en cours...
                </p>
                <img src="/MAP2-300.png" alt="Chargement..." style={{ maxWidth: "300px" }} />
            </div>
        );
    }

    return (
        <div>
            <UserConnexionButton setIsModalOpen={setIsModalOpen} />
            {!isModalOpen && (
                <RoutePlanner
                    onStartNavigation={handleNavigationStart}
                    routes={routes}
                    setGraphhopperData={setGraphhopperData}
                />
            )}
            <div className="map">
                <Map
                    key={JSON.stringify(graphhopperData?.paths?.[0]?.points || "")} 
                    graphhopperResponse={graphhopperData}
                    incidents={incidents}
                />
            </div>
        </div>
    );
}
