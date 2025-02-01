import UserConnexionButton from "../userConnexionButton/UserConnexionButton";
import Map from "../map/map";
import RoutePlanner from "../routePlanner/RoutePlanner";


export default function HomePage() {

    function handleNavigationStart(start, destination) {
        alert(`Départ: ${start}, Destination: ${destination}`);
    };

    return (
        <div >
            <UserConnexionButton />
            <RoutePlanner onStartNavigation={handleNavigationStart} />
            <div className="map">
                <Map />
            </div>
        </div>
    )
};