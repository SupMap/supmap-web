import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Stats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  async function fetchUserInfo() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");

      const response = await axios.get("http://localhost:8080/api/user/info", {
        headers: { Authorization: `${token}` },
      });

      const userData = response.data;
      setUser(userData);

      if (userData.role !== "Administrateur") {
        navigate("/404");
      } else {
        fetchStats();
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      navigate("/404");
    }
  }

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/stats", {
        headers: { Authorization: `${token}` },
      });
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur de chargement des stats :", err);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (val) => typeof val === "number" ? new Intl.NumberFormat("fr-FR").format(val) : val;

  if (loading)
    return (
      <div className="center-container">
        <img src="/MAP2-300.png" alt="Chargement..." className="center-image" />
        <p className="center-message">Chargement des données...</p>
      </div>
    );

  if (error || !stats)
    return (
      <div className="text-center text-danger py-5">
        {error || "Aucune donnée disponible."}
      </div>
    );

  const allStatsItineraries = [
    { label: "Trajets en cours", value: stats.ongoingTrips },
    { label: "Trajets aujourd’hui", value: stats.tripsToday },
    { label: "Trajets ce mois", value: stats.tripsThisMonth },
    { label: "Trajets cette année", value: stats.tripsThisYear },
    { label: "Durée moyenne", value: `${stats.averageTripDuration} min` },
    { label: "Distance moyenne", value: `${stats.averageTripDistance} km` },
  ];

  const allStatsIncidents = [
    { label: "Incidents en cours", value: stats.ongoingIncidents },
    { label: "Incidents aujourd’hui", value: stats.incidentsToday },
    { label: "Incidents ce mois", value: stats.incidentsThisMonth },
    { label: "Incidents cette année", value: stats.incidentsThisYear },
  ];

  const annualTrips = stats.tripsPerYear || [];
  const annualIncidents = stats.incidentsPerYear || [];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-primary fw-bold secondaryButton"
          onClick={() => navigate("/")}
        >
          ← Retour à l’accueil
        </button>
        <img src="/MAP2-300.png" alt="Logo" height="60" />
      </div>

      <h2 className="mb-4">Statistiques Générales</h2>

      <div className="mb-5">
        <h3>Itinéraires</h3>
        <div className="row mb-5">
          {allStatsItineraries.map((item, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div className="card text-center mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.label}</h5>
                  <p className="display-6">{formatNumber(item.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <div className="card p-4">
            <h4 className="text-center mb-4">Évolution des Trajets</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={annualTrips}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="trips"  />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h3>Incidents</h3>
        <div className="row mb-5">
          {allStatsIncidents.map((item, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div className="card text-center mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.label}</h5>
                  <p className="display-6">{formatNumber(item.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <div className="card p-4">
            <h4 className="text-center mb-4">Évolution des Incidents</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={annualIncidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="incidents"  />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
