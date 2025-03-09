import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';
import polyline from '@mapbox/polyline';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const defaultCenter = { lat: 47.383333, lng: 0.683333 };

export default function Map({ graphhopperResponse }) {
    const [center, setCenter] = useState(defaultCenter);
    const [userLocation, setUserLocation] = useState(null);
    const [routePath, setRoutePath] = useState([]);
    const mapRef = useRef(null);

    // Zoom initial pour la localisation utilisateur (plus rapproché)
    const initialZoom = 14;
    const [mapZoom, setMapZoom] = useState(initialZoom);

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Stocke l'instance de la carte
    const onLoad = (map) => {
        mapRef.current = map;
    };

    // Centrage initial sur la position de l'utilisateur
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userPos = { lat: latitude, lng: longitude };
                    setCenter(userPos);
                    setUserLocation(userPos);
                    if (mapRef.current) {
                        mapRef.current.setCenter(userPos);
                        mapRef.current.setZoom(initialZoom);
                    }
                },
                (error) => {
                    console.error("Erreur de localisation :", error);
                    alert("La localisation est désactivée ou refusée.");
                }
            );
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    }, []);

    // Décodage de la polyline et mise à jour de l'itinéraire
    useEffect(() => {
        setRoutePath([]);
        if (graphhopperResponse) {
            console.log("GraphHopper response:", graphhopperResponse);
            try {
                const encodedPolyline = graphhopperResponse.paths[0].points;
                console.log("Encoded polyline:", encodedPolyline);
                const decoded = polyline.decode(encodedPolyline);
                const path = decoded.map(([lat, lng]) => ({ lat, lng }));
                console.log("Decoded path:", path);
                setRoutePath(path);
            } catch (err) {
                console.error("Erreur lors du décodage de la polyline:", err);
            }
        }
    }, [graphhopperResponse]);

    // Ajustement de la vue de la carte en fonction de l'itinéraire
    useEffect(() => {
        if (routePath.length > 0 && mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            routePath.forEach(point => {
                bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
            });
            mapRef.current.fitBounds(bounds);
        } else if (routePath.length === 0 && mapRef.current && userLocation) {
            // Si aucun itinéraire n'est présent, recentrer sur la localisation de l'utilisateur avec le zoom initial
            mapRef.current.setCenter(userLocation);
            mapRef.current.setZoom(initialZoom);
        }
    }, [routePath, userLocation]);

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={mapZoom}
                onLoad={onLoad}
            >
                {userLocation && <Marker position={userLocation} title="Votre position" />}
                {routePath.length > 0 && (
                    <Polyline
                        path={routePath}
                        options={{ strokeColor: '#3d2683', strokeWeight: 4 }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
}
