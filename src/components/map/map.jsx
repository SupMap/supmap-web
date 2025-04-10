import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';
import polyline from '@mapbox/polyline';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const defaultCenter = { lat: 47.383333, lng: 0.683333 };

export default function Map({ graphhopperResponse, incidents }) {
    const [center, setCenter] = useState(defaultCenter);
    const [userLocation, setUserLocation] = useState(null);
    const [routePath, setRoutePath] = useState([]);
    const mapRef = useRef(null);
    const initialZoom = 14;

    function onLoad(map) {
        mapRef.current = map;
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
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
        }
    }, []);

    useEffect(() => {
        setRoutePath([]);
        if (graphhopperResponse) {
            try {
                const encodedPolyline = graphhopperResponse.paths[0].points;
                const decoded = polyline.decode(encodedPolyline);
                const path = decoded.map(([lat, lng]) => ({ lat, lng }));
                setRoutePath(path);
            } catch (err) {
                console.error("Erreur lors du décodage de la polyline:", err);
            }
        }
    }, [graphhopperResponse]);

    useEffect(() => {
        if (routePath.length > 0 && mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            routePath.forEach(point => bounds.extend(new window.google.maps.LatLng(point.lat, point.lng)));
            mapRef.current.fitBounds(bounds);
        } else if (routePath.length === 0 && mapRef.current && userLocation) {
            mapRef.current.setCenter(userLocation);
            mapRef.current.setZoom(initialZoom);
        }
    }, [routePath, userLocation]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={initialZoom}
            onLoad={onLoad}
            options={{
                disableDefaultUI: true 
              }}
        >
            
            {userLocation && (
                <Marker position={userLocation} title="Votre position" />
            )}

            
            {routePath.length > 0 && (
                <Polyline
                    path={routePath}
                    options={{ strokeColor: '#3d2683', strokeWeight: 4 }}
                />
            )}

            
            {routePath.length > 0 && (
                <Marker
                    position={routePath[0]}
                    title="Point de départ"
                    icon={{
                        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                                <text x="0" y="20">📍</text>
                            </svg>`),
                        scaledSize: new window.google.maps.Size(30, 30)
                    }}
                />
            )}

            
            {routePath.length > 0 && (
                <Marker
                    position={routePath[routePath.length - 1]}
                    title="Destination"
                    icon={{
                        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                                <text x="0" y="20">🏁</text>
                            </svg>`),
                        scaledSize: new window.google.maps.Size(30, 30)
                    }}
                />
            )}

            
            {incidents && incidents.map((incident, index) => {
                const position = { lat: incident.latitude, lng: incident.longitude };
                const iconUrl = incident.typeId === 1 ? '/accident.svg' : '/incident.svg';
                return (
                    <Marker
                        key={index}
                        position={position}
                        title={`Incident (type ${incident.typeId})`}
                        icon={{ url: iconUrl, scaledSize: new window.google.maps.Size(30, 30) }}
                    />
                );
            })}
        </GoogleMap>
    );
}
