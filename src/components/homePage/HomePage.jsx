import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";
import axios from "axios";
import { useState } from "react";


export default function HomePage() {

    const [directions, setDirections] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleNavigationStart(start, destination, travelMode) {
        const response = await axios.get(`http://localhost:8080/api/directions?origin=${start}&destination=${destination}&mode=${travelMode}`);

        if (response.data) {
            console.log("Itinéraire récupéré :", response.data);

            // 🔹 Appeler l'API Google Maps pour convertir la réponse en objet DirectionsRenderer
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: start,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode[travelMode.toUpperCase()]
                },
                (result, status) => {
                    if (status === "OK") {
                        setDirections(result);
                    } else {
                        console.error("Erreur de calcul d'itinéraire :", status);
                    }
                }
            );
        } else {
            throw new Error("Itinéraire non trouvé.");
        }
    }

    return (
        <div>
            <UserConnexionButton setIsModalOpen={setIsModalOpen} />
            {!isModalOpen && <RoutePlanner onStartNavigation={handleNavigationStart} />}
            <div className="map">
                <Map directions={directions} />
            </div>
        </div>
    );
}