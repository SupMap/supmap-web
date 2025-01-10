
import L from "leaflet"; // Importation de Leaflet
import { useEffect } from "react";
import UserCircle from "../userCircle/UserCircle";


export default function HomePage() {
    useEffect(() => {
        // Vérifie si la carte existe déjà et la supprime si c'est le cas
        if (L.DomUtil.get('carte')?._leaflet_id != null) {
            return; // Empêche la réinitialisation
        }

        // Initialisation de la carte uniquement si elle n'existe pas
        const macarte = L.map("carte").setView([48.852969, 2.349903], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'Données © OpenStreetMap France',
            minZoom: 1,
            maxZoom: 20
        }).addTo(macarte);

        // Nettoyage de la carte lors du démontage du composant
        return () => {
            macarte.remove();
        };

    }, []);
    

    return (
        < div id="carte">
            <UserCircle />
        </div >
    )
}