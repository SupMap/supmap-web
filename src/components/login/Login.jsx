import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  return (
    <div >
      <div className="d-flex justify-content-center">
        <img src="MAP2-300.png" alt="Map" className="img-fluid mb-4 w-25" />
      </div>

      <h2 className="text-center fw-bold mb-4 primaryColor">Bon retour parmi nous !</h2>

       <Form>
        <Form.Control type="email" placeholder="Entrez votre email" className="mb-3" />

        <Form.Control type="password" placeholder="Entrez votre mot de passe" className="mb-3" />

        <Button type="submit" className="w-100 mb-3 secondaryButton">
          Se connecter
        </Button>

        <Button className="w-100 mb-3 d-flex align-items-center justify-content-center primaryButton">
          <i className="bi bi-google me-2" />
          Se connecter avec Google
        </Button>

      </Form>
      <a href="#" className="text-center d-block secondaryColor">Mot de passe oublié ?</a>
      <div className="mt-4 text-center ">
        <p>Vous ne possédez pas de compte ?</p>
        <a href='/register' className="primaryColor">Inscrivez vous ici</a>
      </div>
    </div>
  );
}