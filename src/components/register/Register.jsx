import React from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <Card.Body>
          <h2 className="text-center text-primary fw-bold mb-4">Inscription</h2>
          <Form>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Adresse Email</Form.Label>
              <Form.Control type="email" placeholder="Entrez votre email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Entrez votre mot de passe" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Confirmez le mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Entrez votre mot de passe" />
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100 mb-3">
              S'inscrire
            </Button>
          </Form>
          <div className="mt-4 text-center">
            <p>Vous possédez déjà un compte ?</p>
            <a href='/login'>Connectez vous ici</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
