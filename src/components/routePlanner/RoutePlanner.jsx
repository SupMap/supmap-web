import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Car, Bike, Footprints, MapPin, Flag, QrCode } from "lucide-react";
import { Autocomplete } from '@react-google-maps/api';
import QRCode from 'react-qr-code';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoutePlanner({ onStartNavigation, routes = [], setGraphhopperData }) {
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');
    const [travelMode, setTravelMode] = useState('car');
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [showCurrentLocation, setShowCurrentLocation] = useState(false);
    const [showQR, setShowQR] = useState(false);

    function onLoadStart(autoC) {
        setAutocompleteStart(autoC);
    }
    
    function onLoadEnd(autoC) {
        setAutocompleteEnd(autoC);
    }

    useEffect(() => {
        if (window.google && !geocoder) {
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [geocoder]);

    function onPlaceChangedStart() {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            setStartPoint(place.formatted_address || place.name);
        }
    };

    function onPlaceChangedEnd() {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            setDestination(place.formatted_address || place.name);
        }
    };

    function handleUseCurrentLocation() {
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
        onStartNavigation(startPoint, destination, travelMode);
    };

    return (
        <div className="position-absolute start-0 ms-3 p-3 shadow-lg bg-white bg-opacity-75" style={{ top: '20px', width: '360px', zIndex: 2000 }}>
            <Form>

                <Form.Group className="mb-3" style={{ position: 'relative' }}>
                    <Autocomplete
                        onLoad={onLoadStart}
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
                        <div onClick={handleUseCurrentLocation} style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: '#fff',
                            border: '1px solid #ced4da',
                            borderTop: 'none',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem'
                        }}>
                            <MapPin size={16} />
                            Utiliser ma position actuelle
                        </div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Autocomplete
                        onLoad={onLoadEnd}
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

                <Button onClick={handleStartClick} className="w-100 primaryButton fw-bold">Démarrer</Button>
            </Form>

            {routes.length > 0 && (
                <div className="mt-3">
                    <h6>Itinéraires</h6>
                    {routes.map((route, index) => {
                        const path = route.data.paths[0];
                        const timeMin = Math.round(path.time / 60000);
                        const distanceKm = (path.distance / 1000).toFixed(1);
                        const arrivalTime = new Date(Date.now() + path.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div
                                key={index}
                                className="border rounded p-2 mb-2 bg-light"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setGraphhopperData(route.data)}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{timeMin} min</strong> <span className="text-muted">Arrivée à {arrivalTime}</span>
                                    </div>
                                    <span className="badge bg-primary">{route.label}</span>
                                </div>
                                <small className="text-muted">{path.description || path.instructions?.[0]?.text || ""}</small><br />
                                <small className="text-muted">{distanceKm} km</small>
                            </div>
                        );
                    })}

                    {destination && (
                        <div className="mt-3 text-center">
                            <div onClick={() => setShowQR(!showQR)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <QrCode size={24} />
                                <span>Générer QR Code</span>
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
