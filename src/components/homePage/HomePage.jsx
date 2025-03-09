import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";
import axios from "axios";
import { useState } from "react";

export default function HomePage() {
    const [graphhopperData, setGraphhopperData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleNavigationStart(start, destination, travelMode) {
        try {
            // Appel à votre API backend qui interroge GraphHopper
            const response = await axios.get(`http://localhost:8080/api/directions?origin=${start}&destination=${destination}&mode=${travelMode}`);
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

    return (
        <div>
            <UserConnexionButton setIsModalOpen={setIsModalOpen} />
            {!isModalOpen && <RoutePlanner onStartNavigation={handleNavigationStart} />}
            <div className="map">
                <Map graphhopperResponse={graphhopperData} />
            </div>
        </div>
    );
}
