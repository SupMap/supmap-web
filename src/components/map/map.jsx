import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const VITE_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const defaultCenter = {
    lat: 47.383333, 
    lng: 0.683333 
};

export default function Map({ directions }) {
    const [center, setCenter] = useState(defaultCenter);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.log("Erreur de localisation :", error);
                    alert("La localisation est désactivée ou refusée.");
                }
            );
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    }, []);

    return (
        <LoadScript googleMapsApiKey={VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={17}
            >
                {userLocation && <Marker position={userLocation} title="Votre position" />}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
}
