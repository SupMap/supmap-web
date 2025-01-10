import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  return (
    <div>
        <h2 className="text-center text-primary fw-bold mb-4">Connexion</h2>
        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Adresse Email</Form.Label>
            <Form.Control type="email" placeholder="Entrez votre email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control type="password" placeholder="Entrez votre mot de passe" />
          </Form.Group>

          <Button variant="danger" type="submit" className="w-100 mb-3">
            Se connecter
          </Button>
        </Form>
        <a href="#" className="text-danger text-center d-block">Mot de passe oublié ?</a>
        <div className="mt-4 text-center">
          <p>Vous ne possédez pas de compte ?</p>
          <a href='/register'>Inscrivez vous ici</a>
        </div>
    </div>
  );
}