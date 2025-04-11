import {GoogleMap, Marker} from '@react-google-maps/api';
import {useEffect, useRef, useState} from 'react';
import polyline from '@mapbox/polyline';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const defaultCenter = {lat: 47.383333, lng: 0.683333};

export default function Map({routes = [], incidents, selectedRouteIndex = 0}) {
    const [center, setCenter] = useState(defaultCenter);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const routePolylinesRef = useRef([]);
    const initialZoom = 14;

    function onLoad(map) {
        mapRef.current = map;
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {lat: position.coords.latitude, lng: position.coords.longitude};
                    setCenter(pos);
                    setUserLocation(pos);
                    if (mapRef.current) {
                        mapRef.current.setCenter(pos);
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
        routePolylinesRef.current.forEach(poly => poly.setMap(null));
        routePolylinesRef.current = [];

        if (!mapRef.current || routes.length === 0) return;

        routes.forEach((route, index) => {
            try {
                const decoded = polyline.decode(route.data.paths[0].points);
                const path = decoded.map(([lat, lng]) => ({lat, lng}));

                const poly = new window.google.maps.Polyline({
                    path,
                    map: mapRef.current,
                    strokeColor: '#3d2683',
                    strokeOpacity: index === selectedRouteIndex ? 1.0 : 0.2,
                    strokeWeight: index === selectedRouteIndex ? 5 : 4,
                    zIndex: index === selectedRouteIndex ? 2 : 1,
                });

                routePolylinesRef.current.push(poly);

                // Zoom automatique sur l'itinéraire principal
                if (index === selectedRouteIndex) {
                    const bounds = new window.google.maps.LatLngBounds();
                    path.forEach(point => bounds.extend(point));
                    mapRef.current.fitBounds(bounds);
                }

            } catch (err) {
                console.error("Erreur lors du décodage de la route :", err);
            }
        });

    }, [routes, selectedRouteIndex]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={initialZoom}
            onLoad={onLoad}
            options={{disableDefaultUI: true}}
        >
            {userLocation && (
                <Marker position={userLocation} title="Votre position"/>
            )}

            {routes[selectedRouteIndex] && (() => {
                const decoded = polyline.decode(routes[selectedRouteIndex].data.paths[0].points);
                const points = decoded.map(([lat, lng]) => ({lat, lng}));
                return (
                    <>
                        <Marker
                            position={points[0]}
                            title="Point de départ"
                            icon={{
                                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><text x="0" y="20">📍</text></svg>`),
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                        />
                        <Marker
                            position={points[points.length - 1]}
                            title="Destination"
                            icon={{
                                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><text x="0" y="20">🏁</text></svg>`),
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                        />
                    </>
                );
            })()}

            {incidents && incidents.map((incident, idx) => {
                const position = {lat: incident.latitude, lng: incident.longitude};
                return (
                    <Marker
                        key={idx}
                        position={position}
                        title={`Incident (type ${incident.typeId})`}
                        icon={{url: '/accident.svg', scaledSize: new window.google.maps.Size(30, 30)}}
                    />
                );
            })}
        </GoogleMap>
    );
}
