import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoutePlanner({ onStartNavigation }) {
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');

    function handleStartClick() {
        onStartNavigation(startPoint, destination);
    };

    return (
        <div className="position-absolute start-0 ms-3 p-3 shadow-lg bg-white bg-opacity-75" style={{ top: '100px', width:'300px', zIndex: 2000 }}>
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