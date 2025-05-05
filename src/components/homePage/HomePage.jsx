// ---------- HomePage.jsx ----------
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
    const [isLoading, setIsLoading] = useState(false);

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "VITE_GOOGLE_MAPS_API_KEY_PLACEHOLDER";
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey, libraries });

    const formatLatLng = (location) =>
        typeof location === 'object' && location.lat !== undefined && location.lng !== undefined
            ? `${location.lat},${location.lng}`
            : location;

    async function handleNavigationStart(start, destination, travelMode) {
        setIsLoading(true);
        setRoutes([]);
        setGraphhopperData(null);
        setSelectedRouteIndex(0);

        const startParam = formatLatLng(start);
        const destinationParam = formatLatLng(destination);

        try {
            const response = await axios.get(`http://localhost:8080/api/directions?origin=${encodeURIComponent(startParam)}&destination=${encodeURIComponent(destinationParam)}&mode=${encodeURIComponent(travelMode)}`);
            const { fastest, noToll, economical, paths } = response.data;

            let routeOptions = [];

            if (fastest && noToll && economical) {
                const parsed = {
                    fastest: typeof fastest === 'string' ? JSON.parse(fastest) : fastest,
                    noToll: typeof noToll === 'string' ? JSON.parse(noToll) : noToll,
                    economical: typeof economical === 'string' ? JSON.parse(economical) : economical
                };

                routeOptions = [
                    { label: "Meilleur itin.", data: parsed.fastest },
                    { label: "Sans péage", data: parsed.noToll },
                    { label: "Économique", data: parsed.economical }
                ];

                const seen = new Set();
                routeOptions = routeOptions.filter(route => {
                    const encoded = route.data?.paths?.[0]?.points;
                    if (encoded && !seen.has(encoded)) {
                        seen.add(encoded);
                        return true;
                    }
                    return false;
                });
            } else if (paths) {
                routeOptions = [{ label: "Itinéraire", data: response.data }];
            }

            setRoutes(routeOptions);
            const selectedData = routeOptions[0]?.data || null;
            setGraphhopperData(selectedData);

        } catch (error) {
            console.error("Erreur lors de la récupération des itinéraires :", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const handleRouteSelection = (e) => {
            setSelectedRouteIndex(e.detail);
        };
        window.addEventListener('route-selection', handleRouteSelection);
        return () => window.removeEventListener('route-selection', handleRouteSelection);
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
                <Map routes={routes} selectedRouteIndex={selectedRouteIndex} />
            </div>
            <div className="custom-map-logo">
                <img src="/x.png" alt="collab" height="15px" style={{ marginTop: '8px' }} />
                <img src="/MAP2-300.png" alt="Notre Marque" height="36px" style={{ marginLeft: '5px' }} />
            </div>
        </div>
    );
}
