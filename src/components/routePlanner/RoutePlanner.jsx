import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Car, Bike, Footprints } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoutePlanner({ onStartNavigation }) {
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');
    const [travelMode, setTravelMode] = useState('driving'); // État pour le mode de transport

    function handleStartClick() {
        onStartNavigation(startPoint, destination, travelMode);
    }

    return (
        <div className="position-absolute start-0 ms-3 p-3 shadow-lg bg-white bg-opacity-75" style={{ top: '100px', width: '300px', zIndex: 2000 }}>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Choisissez votre point de départ"
                        value={startPoint}
                        onChange={(e) => setStartPoint(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Choisissez votre destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </Form.Group>

                {/* Sélecteur de mode de transport */}
                <div className="d-flex justify-content-between mb-3">
                    <Button variant={travelMode === 'driving' ? 'primary' : 'light'} onClick={() => setTravelMode('driving')}>
                        <Car size={25} />
                    </Button>
                    <Button variant={travelMode === 'bicycling' ? 'primary' : 'light'} onClick={() => setTravelMode('bicycling')}>
                        <Bike size={25} />
                    </Button>
                    <Button variant={travelMode === 'walking' ? 'primary' : 'light'} onClick={() => setTravelMode('walking')}>
                        <Footprints size={25} />
                    </Button>
                </div>

                <Button
                    onClick={handleStartClick}
                    className="w-100 primaryButton"
                    style={{ fontWeight: 'bold' }}
                >
                    Démarrer
                </Button>
            </Form>
        </div>
    );
}
