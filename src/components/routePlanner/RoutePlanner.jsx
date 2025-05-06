import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Bike, Car, Flag, Footprints, MapPin, QrCode } from "lucide-react";
import { Autocomplete } from '@react-google-maps/api';
import QRCode from 'react-qr-code';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoutePlanner({
    onStartNavigation,
    routes = [],
    setGraphhopperData,
    setSelectedRouteIndex,
    selectedRouteIndex,
    isLoading
}) {
    const [startPoint, setStartPoint] = useState('');
    const [startCoordinates, setStartCoordinates] = useState(null);
    const [destination, setDestination] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);
    const [travelMode, setTravelMode] = useState('car');
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [showCurrentLocation, setShowCurrentLocation] = useState(false);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        if (window.google && !geocoder) {
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [geocoder]);

    const onPlaceChangedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            setStartPoint(place.formatted_address || place.name);
            if (place.geometry) {
                setStartCoordinates({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        }
    };

    const onPlaceChangedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            setDestination(place.formatted_address || place.name);
            if (place.geometry) {
                setDestinationCoordinates({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation || !geocoder) {
            alert("La géolocalisation est désactivée ou non supportée.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latlng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                geocoder.geocode({ location: latlng }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        setStartPoint(results[0].formatted_address);
                        setStartCoordinates(latlng);
                        setShowCurrentLocation(false);
                    } else {
                        alert("Impossible de récupérer l'adresse.");
                    }
                });
            },
            () => {
                alert("Impossible de récupérer votre position.");
            }
        );
    };

    const handleStartClick = () => {
        if (startCoordinates && destinationCoordinates) {
            onStartNavigation(startCoordinates, destinationCoordinates, travelMode);
        } else if (startPoint && destination) {
            onStartNavigation(startPoint, destination, travelMode);
        } else {
            alert("Veuillez entrer un point de départ et une destination valides.");
        }
    };

    const handleQRCodeClick = async () => {
        setShowQR(!showQR);

        if (!showQR) {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("Utilisateur non connecté. Itinéraire non sauvegardé.");
                return;
            }

            const selectedRoute = routes[selectedRouteIndex];
            const path = selectedRoute?.data?.paths?.[0];

            if (!path) {
                console.warn("Aucun itinéraire sélectionné.");
                return;
            }

            const customModel = selectedRoute.label === "Sans péage" ? "noToll" : "default";

            try {
                await axios.post("http://localhost:8080/api/route", {
                    totalDuration: path.time,
                    totalDistance: path.distance,
                    customModel,
                    mode: travelMode,
                    startLocation: `${startCoordinates.lat},${startCoordinates.lng}`,
                    endLocation: `${destinationCoordinates.lat},${destinationCoordinates.lng}`,
                    route: path.points
                }, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                console.log("✅ Itinéraire sauvegardé et envoyé au mobile !");
            } catch (error) {
                console.error("❌ Erreur lors de la sauvegarde de l'itinéraire :", error);
            }
        }
    };

    return (
        <div className="position-absolute start-0 ms-3 p-3 shadow-lg bg-white bg-opacity-75"
            style={{ top: '20px', width: '360px', zIndex: 2000 }}>
            <Form>
                <Form.Group className="mb-3" style={{ position: 'relative' }}>
                    <Autocomplete
                        onLoad={setAutocompleteStart}
                        onPlaceChanged={onPlaceChangedStart}
                        options={{ componentRestrictions: { country: 'fr' } }}
                    >
                        <InputGroup>
                            <InputGroup.Text><MapPin size={18} /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Point de départ"
                                value={startPoint}
                                onChange={(e) => setStartPoint(e.target.value)}
                                onFocus={() => setShowCurrentLocation(true)}
                                onBlur={() => setTimeout(() => setShowCurrentLocation(false), 200)}
                            />
                        </InputGroup>
                    </Autocomplete>
                    {showCurrentLocation && (
                        <div onClick={handleUseCurrentLocation} className="dropdown-menu-current-position">
                            <MapPin size={16} />
                            Utiliser ma position actuelle
                        </div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Autocomplete
                        onLoad={setAutocompleteEnd}
                        onPlaceChanged={onPlaceChangedEnd}
                        options={{ componentRestrictions: { country: 'fr' } }}
                    >
                        <InputGroup>
                            <InputGroup.Text><Flag size={18} /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </InputGroup>
                    </Autocomplete>
                </Form.Group>

                <div className="d-flex justify-content-between mb-3">
                    <Button className={travelMode === 'car' ? 'primaryButton' : 'btn-light'} onClick={() => setTravelMode('car')}>
                        <Car size={25} />
                    </Button>
                    <Button className={travelMode === 'bike' ? 'primaryButton' : 'btn-light'} onClick={() => setTravelMode('bike')}>
                        <Bike size={25} />
                    </Button>
                    <Button className={travelMode === 'foot' ? 'primaryButton' : 'btn-light'} onClick={() => setTravelMode('foot')}>
                        <Footprints size={25} />
                    </Button>
                </div>

                <Button onClick={handleStartClick} className="w-100 primaryButton fw-bold" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Chargement...
                        </>
                    ) : (
                        "Rechercher"
                    )}
                </Button>
            </Form>

            {routes.length > 0 && (
                <div className="mt-3">
                    <h6>Itinéraires</h6>
                    {routes.map((route, index) => {
                        const path = route.data.paths[0];
                        const timeMin = Math.round(path.time / 60000);
                        const hours = Math.floor(timeMin / 60);
                        const minutes = timeMin % 60;
                        const travelTime = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
                        const distanceKm = (path.distance / 1000).toFixed(1);
                        const arrivalTime = new Date(Date.now() + path.time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        let icon = "/path/to/road-icon.png";
                        if (route.label === "Meilleur itin.") icon = "/best.png";
                        else if (route.label === "Sans péage") icon = "/peage.png";
                        else if (route.label === "Économique") icon = "/econo.png";

                        return (
                            <div
                                key={index}
                                className={`route-item border rounded p-2 mb-2 ${selectedRouteIndex === index ? 'selected-route' : 'bg-light'}`}
                                onClick={() => {
                                    setGraphhopperData(route.data);
                                    setSelectedRouteIndex(index);
                                }}
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{travelTime}</strong>{" "}
                                        <span className="text-muted">Arrivée à {arrivalTime}</span>
                                    </div>
                                    <span className="badge bg-light border text-dark fw-medium d-flex align-items-center gap-2"
                                        style={{ borderRadius: '20px', fontSize: '0.9rem' }}>
                                        <img src={icon} alt="Icon" style={{ width: '30px', height: '30px' }} />
                                        {route.label}
                                    </span>
                                </div>
                                <small className="text-muted">{path.description || path.instructions?.[0]?.text || ""}</small><br />
                                <small className="text-muted">{distanceKm} km</small>
                            </div>
                        );
                    })}

                    {destination && localStorage.getItem("token") && (
                        <div className="mt-3 text-center">
                            <div onClick={handleQRCodeClick} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <QrCode size={24} />
                                <span>Envoyer au Mobile</span>
                            </div>
                            {showQR && (
                                <div className="mt-3">
                                    <QRCode
                                        value={`myapp://navigate?destination=${encodeURIComponent(destination)}`}
                                        size={180}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="H"
                                    />
                                    <p className="small mt-2 text-muted">Scannez avec l'application mobile</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
