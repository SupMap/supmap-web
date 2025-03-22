import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Car, Bike, Footprints } from "lucide-react";
import { Autocomplete } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoutePlanner({ onStartNavigation }) {
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');
    const [travelMode, setTravelMode] = useState('car');
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);

    const onLoadStart = (autoC) => setAutocompleteStart(autoC);
    const onLoadEnd = (autoC) => setAutocompleteEnd(autoC);

    const onPlaceChangedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            setStartPoint(place.formatted_address || place.name);
        }
    };

    const onPlaceChangedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            setDestination(place.formatted_address || place.name);
        }
    };

    const handleStartClick = () => {
        onStartNavigation(startPoint, destination, travelMode);
    };

    return (
        <div className="position-absolute start-0 ms-3 p-3 shadow-lg bg-white bg-opacity-75" style={{ top: '100px', width: '300px', zIndex: 2000 }}>
            <Form>
                <Form.Group className="mb-3">
                    <Autocomplete
                        onLoad={onLoadStart}
                        onPlaceChanged={onPlaceChangedStart}
                        options={{
                            componentRestrictions: { country: 'fr' }
                        }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Choisissez votre point de départ"
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                        />
                    </Autocomplete>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Autocomplete
                        onLoad={onLoadEnd}
                        onPlaceChanged={onPlaceChangedEnd}
                        options={{
                            componentRestrictions: { country: 'fr' }
                        }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Choisissez votre destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </Autocomplete>
                </Form.Group>
                <div className="d-flex justify-content-between mb-3">
                    <Button variant={travelMode === 'car' ? 'primary' : 'light'} onClick={() => setTravelMode('car')}><Car size={25} /></Button>
                    <Button variant={travelMode === 'bike' ? 'primary' : 'light'} onClick={() => setTravelMode('bike')}><Bike size={25} /></Button>
                    <Button variant={travelMode === 'foot' ? 'primary' : 'light'} onClick={() => setTravelMode('foot')}><Footprints size={25} /></Button>
                </div>

                <Button onClick={handleStartClick} className="w-100 primaryButton" style={{ fontWeight: 'bold' }}>Démarrer</Button>
            </Form>
        </div>
    );
}