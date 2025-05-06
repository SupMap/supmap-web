import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from "recharts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Stats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--primaryColor", "#3d2683");
    document.documentElement.style.setProperty("--secondaryColor", "#F15B4E");
    document.body.style.backgroundColor = "#f4f7fe";
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
      if (userData.role !== "Administrateur") {
        navigate("/404");
      } else {
        fetchStats(token);
      }
    } catch (err) {
      console.error("Erreur utilisateur :", err);
      navigate("/404");
    }
  }

  async function fetchStats(token) {
    try {
      const response = await axios.get("http://localhost:8080/api/stats", {
        headers: { Authorization: `${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error("Erreur stats :", err);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (val) =>
    typeof val === "number" ? new Intl.NumberFormat("fr-FR").format(val) : val;

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    padding: "20px",
    marginBottom: "20px",
  };

  const titleStyle = {
    color: "var(--primaryColor)",
  };

  const subtitleStyle = {
    color: "var(--secondaryColor)",
    textAlign: "center",
    marginBottom: "20px",
  };

  const statLabel = {
    fontWeight: "bold",
  };

  if (loading) {
    return (
      <div className="center-container">
        <img src="/MAP2-300.png" alt="Chargement..." className="center-image" />
        <p className="center-message">Chargement des données...</p>
      </div>
    );
  } 

  if (error || !stats) {
    return (
      <div className="text-center text-danger py-5">
        {error || "Aucune donnée disponible."}
      </div>
    );
  }

  const itineraryStats = [
    { label: "Trajets en cours", value: stats.ongoingTrips },
    { label: "Trajets aujourd’hui", value: stats.tripsToday },
    { label: "Trajets ce mois", value: stats.tripsThisMonth },
    { label: "Trajets cette année", value: stats.tripsThisYear },
    { label: "Durée moyenne", value: `${(stats.averageTripDuration / 60000).toFixed(1)} min` },
    { label: "Distance moyenne", value: `${(stats.averageTripDistance / 1000).toFixed(1)} km` },
  ];

  const incidentStats = [
    { label: "Incidents en cours", value: stats.ongoingIncidents },
    { label: "Incidents aujourd’hui", value: stats.incidentsToday },
    { label: "Incidents ce mois", value: stats.incidentsThisMonth },
    { label: "Incidents cette année", value: stats.incidentsThisYear },
  ];

  const dailyTrips = stats.tripsPerDay
    ? Object.entries(stats.tripsPerDay).map(([timestamp, count]) => {
        const date = new Date(timestamp);
        return {
          date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          trips: count,
        };
      })
    : [];

  const hourlyIncidents = stats.incidentsPerHour
    ? Object.entries(stats.incidentsPerHour).map(([timestamp, count]) => {
        const date = new Date(timestamp);
        return {
          hour: date.getHours().toString().padStart(2, "0") + "h",
          incidents: count,
        };
      })
    : [];

  return (
    <div className="container py-4">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "var(--primaryColor)",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          ← Retour à l’accueil
        </button>
        <img src="/MAP2-300.png" alt="Logo" height="60" />
      </div>

      <h2 style={{ ...titleStyle, marginBottom: "30px" }}>Statistiques Générales</h2>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={titleStyle}>Itinéraires</h3>
        <div className="row mb-4">
          {itineraryStats.map((item, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div style={cardStyle}>
                <h5 style={statLabel}>{item.label}</h5>
                <p className="display-6">{formatNumber(item.value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h4 style={subtitleStyle}>Évolution quotidienne des Trajets</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrips}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trips" stroke="var(--primaryColor)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 style={titleStyle}>Incidents</h3>
        <div className="row mb-4">
          {incidentStats.map((item, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div style={cardStyle}>
                <h5 style={statLabel}>{item.label}</h5>
                <p className="display-6">{formatNumber(item.value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h4 style={subtitleStyle}>Incidents par heure (aujourd’hui)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyIncidents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="var(--secondaryColor)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
