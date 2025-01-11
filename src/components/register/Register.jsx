import React from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  return (
    <div >
      <div className="d-flex justify-content-center">
        <img src="MAP2-300.png" alt="Map" className="img-fluid mb-4 w-25" />
      </div>

      <h2 className="text-center fw-bold mb-4 primaryColor">Bienvenue parmi nous!</h2>
      <Form>
        <Form.Control type="input" placeholder="Entrez votre nom d'utilisateur" className="mb-3" />

        <Form.Control type="email" placeholder="Entrez votre email" className="mb-3" />

        <Form.Control type="password" placeholder="Entrez votre mot de passe" className="mb-3" />

        <Form.Control type="password" placeholder="Entrez votre mot de passe" className="mb-3" />

        <Button variant="danger" type="submit" className="w-100 mb-3">
          S'inscrire
        </Button>

        <Button className="w-100 mb-3 d-flex align-items-center justify-content-center primaryButton">
          <i className="bi bi-google me-2" />
          S'inscire avec Google
        </Button>

      </Form>
      <div className="mt-4 text-center">
        <p>Vous possédez déjà un compte ?</p>
        <a href='/login' className="primaryColor">Connectez vous ici</a>
      </div>
    </div>
  );
}
