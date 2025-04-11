-- docker run --name supmap-database -e POSTGRES_USER=supmap -e POSTGRES_PASSWORD=supmap -e POSTGRES_DB=supmap-database -p 5432:5432 -d postgis/postgis

-- Activation de l'extension PostGIS (si elle n'est pas déjà installée)
CREATE EXTENSION IF NOT EXISTS postgis;

-------------------------------------------
-- Table des catégories d'incidents
-------------------------------------------
CREATE TABLE incident_categories
(
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE
);

-------------------------------------------
-- Table des types d'incidents (avec poids)
-------------------------------------------
CREATE TABLE incident_types
(
    type_id     SERIAL PRIMARY KEY,
    category_id INT              NOT NULL REFERENCES incident_categories (category_id),
    name        VARCHAR(50)      NOT NULL UNIQUE,
    weight      DOUBLE PRECISION NOT NULL DEFAULT 1.0 -- Poids par défaut, pour évaluer l'impact de ce type d'incident
);
-------------------------------------------
-- Table des roles
-------------------------------------------
CREATE TABLE roles
(
    role_id SERIAL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL UNIQUE
);

-------------------------------------------
-- Table des utilisateurs
-------------------------------------------
CREATE TABLE users
(
    user_id       SERIAL PRIMARY KEY,
    username      VARCHAR(255) NOT NULL UNIQUE,
    name          VARCHAR(255),
    second_name   VARCHAR(255),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    oauth2_id     INT,
    role          INT          NOT NULL DEFAULT 1 REFERENCES roles (role_id),
    contribution  INT          NOT NULL DEFAULT 0
);

-------------------------------------------
-- Table des incidents
-------------------------------------------
CREATE TABLE incidents
(
    incident_id          SERIAL PRIMARY KEY,
    type_id              INT                    NOT NULL REFERENCES incident_types (type_id),
    location             GEOGRAPHY(Point, 4326) NOT NULL,
    created_at           TIMESTAMP              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date      TIMESTAMP              NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour',
    confirmed_by_user_id INT REFERENCES users (user_id)
);

-------------------------------------------
-- Table des routes (itinéraires)
-------------------------------------------
CREATE TABLE routes
(
    route_id       SERIAL PRIMARY KEY,
    user_id        INT REFERENCES users (user_id),
    start_location GEOGRAPHY(Point, 4326)      NOT NULL,
    end_location   GEOGRAPHY(Point, 4326)      NOT NULL,
    route_geometry GEOGRAPHY(LineString, 4326) NOT NULL,
    total_distance DOUBLE PRECISION,
    total_duration DOUBLE PRECISION,
    calculated_at  TIMESTAMP                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    custom_model   VARCHAR(50),
    mode           VARCHAR(15)                 NOT NULL DEFAULT 'car'
);
------------------------------------------------
-- Insertion des données
------------------------------------------------

-- Insertion des rôles
INSERT INTO roles (name) VALUES ('Utilisateur');
INSERT INTO roles (name) VALUES ('Modérateur');
INSERT INTO roles (name) VALUES ('Administrateur');

-- Insertion des catégories d'incidents
INSERT INTO incident_categories (name) VALUES ('Accident');
INSERT INTO incident_categories (name) VALUES ('Embouteillage');
INSERT INTO incident_categories (name) VALUES ('Route fermée');
INSERT INTO incident_categories (name) VALUES ('Contrôle policier');
INSERT INTO incident_categories (name) VALUES ('Obstacle sur la route');

-- Insertion des types d'incidents pour la catégorie "Accident"
INSERT INTO incident_types (category_id, name, weight)
VALUES
    ((SELECT category_id FROM incident_categories WHERE name = 'Accident'), 'Collision entre véhicules', 0.75),
    ((SELECT category_id FROM incident_categories WHERE name = 'Accident'), 'Accident multiple', 0.5),
    ((SELECT category_id FROM incident_categories WHERE name = 'Accident'), 'Accident avec blessés', 0.35);

-- Insertion des types d'incidents pour la catégorie "Embouteillage"
INSERT INTO incident_types (category_id, name, weight)
VALUES
    ((SELECT category_id FROM incident_categories WHERE name = 'Embouteillage'), 'Embouteillage majeur', 0.5),
    ((SELECT category_id FROM incident_categories WHERE name = 'Embouteillage'), 'Circulation ralentie', 0.75);

-- Insertion des types d'incidents pour la catégorie "Route fermée"
INSERT INTO incident_types (category_id, name, weight)
VALUES
    ((SELECT category_id FROM incident_categories WHERE name = 'Route fermée'), 'Route bloquée', 0),
    ((SELECT category_id FROM incident_categories WHERE name = 'Route fermée'), 'Travaux en cours', 0.5);

-- Insertion des types d'incidents pour la catégorie "Contrôle policier"
INSERT INTO incident_types (category_id, name, weight)
VALUES
    ((SELECT category_id FROM incident_categories WHERE name = 'Contrôle policier'), 'Radar fixe', 1.0),
    ((SELECT category_id FROM incident_categories WHERE name = 'Contrôle policier'), 'Contrôle mobile', 1.0);

-- Insertion des types d'incidents pour la catégorie "Obstacle sur la route"
INSERT INTO incident_types (category_id, name, weight)
VALUES
    ((SELECT category_id FROM incident_categories WHERE name = 'Obstacle sur la route'), 'Débris sur la route', 0.95),
    ((SELECT category_id FROM incident_categories WHERE name = 'Obstacle sur la route'), 'Animal sur la chaussée', 1.0),
    ((SELECT category_id FROM incident_categories WHERE name = 'Obstacle sur la route'), 'Objet sur la route', 0.95);




INSERT INTO incidents (type_id, location)
VALUES (
           6,
           ST_SetSRID(ST_MakePoint(0.7038658958513232, 47.41738403159333), 4326)
       );
