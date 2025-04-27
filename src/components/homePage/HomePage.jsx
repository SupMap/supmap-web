import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ['places'];

export default function HomePage() {
    const [graphhopperData, setGraphhopperData] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "VITE_GOOGLE_MAPS_API_KEY_PLACEHOLDER";
    const [isLoading, setIsLoading] = useState(false);


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey,
        libraries
    });

    function returnNavigationParams(start, destination) {
        let startParam, destinationParam;
        if ((start.lat !== undefined && start.lng !== undefined) && (destination.lat !== undefined && destination.lng !== undefined)) {
            startParam = `${start.lat},${start.lng}`;
            destinationParam = `${destination.lat},${destination.lng}`;
        } else {
            startParam = start;
            destinationParam = destination;
        }
        return { startParam, destinationParam };
    }

    async function handleNavigationStart(start, destination, travelMode) {
        setIsLoading(true);
        setRoutes([]);
        setGraphhopperData(null);
        setSelectedRouteIndex(0);

        const { startParam, destinationParam } = returnNavigationParams(start, destination);
        try {
            const response = await axios.get(`http://localhost:8080/api/directions?origin=${encodeURIComponent(startParam)}&destination=${encodeURIComponent(destinationParam)}&mode=${encodeURIComponent(travelMode)}`);

            const fastestRaw = response.data.fastest;
            const noTollRaw = response.data.noToll;
            const economicalRaw = response.data.economical;

            if (fastestRaw && noTollRaw && economicalRaw) {
                const parsed = {
                    fastest: typeof fastestRaw === 'string' ? JSON.parse(fastestRaw) : fastestRaw,
                    noToll: typeof noTollRaw === 'string' ? JSON.parse(noTollRaw) : noTollRaw,
                    economical: typeof economicalRaw === 'string' ? JSON.parse(economicalRaw) : economicalRaw
                };

                const routesList = [
                    { label: "Meilleur itin.", data: parsed.fastest },
                    { label: "Sans péage", data: parsed.noToll },
                    { label: "Économique", data: parsed.economical }
                ];

                const uniqueRoutes = [];
                const setOfRoutes = new Set();

                for (const route of routesList) {
                    const encoded = route.data?.paths?.[0]?.points;
                    if (encoded && !setOfRoutes.has(encoded)) {
                        setOfRoutes.add(encoded);
                        uniqueRoutes.push(route);
                    }
                }

                setRoutes(uniqueRoutes);
                setGraphhopperData(uniqueRoutes[0]?.data || null);
                console.log(uniqueRoutes[0]?.data);
            } else if (response.data?.paths) {
                const route = { label: "Meilleur itin.", data: response.data };
                setRoutes([route]);
                setGraphhopperData(response.data);
            } else {
                console.error("Réponse inattendue de l'API :", response.data);
            }
        } catch (error) {
            console.error("Erreur lors de l'obtention de l'itinéraire :", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const handleRouteSelection = (e) => {
            setSelectedRouteIndex(e.detail);
        };

        window.addEventListener('route-selection', handleRouteSelection);
        return () => {
            window.removeEventListener('route-selection', handleRouteSelection);
        };
    }, []);

    if (!isLoaded) {
        return (
            <div className="center-container">
                <img src="/MAP2-300.png" alt="Chargement..." className="center-image" />
                <p className="center-message">Chargement de la carte en cours...</p>
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
                    setSelectedRouteIndex={setSelectedRouteIndex}
                    selectedRouteIndex={selectedRouteIndex}
                    isLoading={isLoading}
                />

            )}
            <div className="map">
                <Map
                    routes={routes}
                    selectedRouteIndex={selectedRouteIndex}
                />
            </div>
            <div className="custom-map-logo">
                <img src="/x.png" alt="collab" height={"15px"}style={{ marginTop: '8px' }} />
                <img src="/MAP2-300.png" alt="Notre Marque" height={"36px"}style={{ marginLeft: '5px' }}  />
            </div>
        </div>

    );
}
