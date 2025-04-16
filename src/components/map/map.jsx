import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import polyline from '@mapbox/polyline';

const containerStyle = {
    width: '100vw',
    height: '100vh',
};

const defaultCenter = { lat: 47.383333, lng: 0.683333 };

export default function Map({ routes = [], selectedRouteIndex = 0, incidents = [] }) {
    const [center, setCenter] = useState(defaultCenter);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const routePolylinesRef = useRef([]);
    const durationMarkersRef = useRef([]);
    const initialZoom = 14;

    function onLoad(map) {
        mapRef.current = map;
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
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
        routePolylinesRef.current.forEach(p => p.setMap(null));
        durationMarkersRef.current.forEach(m => m.setMap(null));
        routePolylinesRef.current = [];
        durationMarkersRef.current = [];

        if (!mapRef.current || routes.length === 0) return;

        routes.forEach((route, index) => {
            try {
                const pathDecoded = polyline.decode(route.data.paths[0].points);
                const path = pathDecoded.map(([lat, lng]) => ({ lat, lng }));

                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primaryColor').trim();
                const poly = new window.google.maps.Polyline({
                    path,
                    map: mapRef.current,
                    strokeColor: primaryColor,
                    strokeOpacity: index === selectedRouteIndex ? 1.0 : 0.5,
                    strokeWeight: index === selectedRouteIndex ? 6 : 4,
                    zIndex: index === selectedRouteIndex ? 2 : 1,
                });

                routePolylinesRef.current.push(poly);

                if (index === selectedRouteIndex) {
                    const bounds = new window.google.maps.LatLngBounds();
                    path.forEach(point => bounds.extend(point));
                    mapRef.current.fitBounds(bounds);
                }

                const duration = Math.round(route.data.paths[0].time / 60000);
                const midPoint = path[Math.floor(path.length / 2)];

                const marker = new window.google.maps.Marker({
                    position: midPoint,
                    map: mapRef.current,
                    icon: {
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="34">
                                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)" />
                                </filter>
                                <rect x="0" y="0" rx="10" ry="10" width="75" height="34" fill="${index === selectedRouteIndex ? '#3d2683' : '#ffffff'}" filter="url(#shadow)" />
                                <text x="37.5" y="22" font-size="14" font-weight="bold" text-anchor="middle" fill="${index === selectedRouteIndex ? '#ffffff' : '#3d2683'}" font-family="Arial">
                                    ${duration} min
                                </text>
                            </svg>
                        `)}`,
                        scaledSize: new window.google.maps.Size(75, 34),
                        anchor: new window.google.maps.Point(37.5, 17),
                    },
                    title: `Itinéraire ${index + 1}`
                });

                marker.addListener('click', () => {
                    const event = new CustomEvent('route-selection', { detail: index });
                    window.dispatchEvent(event);
                });

                durationMarkersRef.current.push(marker);
            } catch (err) {
                console.error("Erreur lors du décodage de la route :", err);
            }
        });
    }, [routes, selectedRouteIndex]);

    const userMarker = userLocation ? (
        <Marker position={userLocation} title="Votre position" />
    ) : null;

    const markers = (() => {
        if (!routes[selectedRouteIndex]) return null;
        const points = polyline.decode(routes[selectedRouteIndex].data.paths[0].points)
            .map(([lat, lng]) => ({ lat, lng }));
        return (
            <>
                
                <Marker
                    position={points[0]}
                    icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                                <circle cx="20" cy="20" r="12" fill="#3d2683" stroke="white" stroke-width="4"/>
                            </svg>
                        `)}`,
                        scaledSize: new window.google.maps.Size(30, 30),
                        anchor: new window.google.maps.Point(20, 20)
                    }}
                />
                <Marker
                    position={points[0]}
                    icon={{
                        url: "/start.png",
                        scaledSize: new window.google.maps.Size(50, 50),
                        anchor: new window.google.maps.Point(29, 50)
                    }}
                    title="Point de départ"
                />

                
                <Marker
                    position={points[points.length - 1]}
                    icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                                <circle cx="20" cy="20" r="12" fill="#F15B4E" stroke="white" stroke-width="4"/>
                            </svg>
                        `)}`,
                        scaledSize: new window.google.maps.Size(30, 30),
                        anchor: new window.google.maps.Point(20, 20)
                    }}
                />
                <Marker
                    position={points[points.length - 1]}
                    icon={{
                        url: "/end.png",
                        scaledSize: new window.google.maps.Size(30, 30),
                        anchor: new window.google.maps.Point(15, 35)
                    }}
                    title="Destination"
                />
            </>
        );
    })();

    const incidentMarkers = incidents.map((incident, idx) => (
        <Marker
            key={idx}
            position={{ lat: incident.latitude, lng: incident.longitude }}
            title={`Incident (type ${incident.typeId})`}
            icon={{ url: '/accident.svg', scaledSize: new window.google.maps.Size(30, 30) }}
        />
    ));

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={initialZoom}
            onLoad={onLoad}
            options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
            }}
        >
            {userMarker}
            {markers}
            {incidentMarkers}
        </GoogleMap>
    );
}
