import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const COLORS = ["#007bff", "#28a745"];

const Stats = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("semaine");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [period]); 

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");

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

  if (loading) return <div style={{width: '100vw',height: '100vh',display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center',textAlign: 'center'}}>
  <p style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
      Chargement des données...
  </p>
  <img src="/MAP2-300.png" alt="Chargement..." style={{ maxWidth: "300px" }} />
</div>;
  if (error || !stats) return <div className="text-center text-danger py-5">{error || "Aucune donnée disponible."}</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary fw-bold secondaryButton" onClick={() => navigate("/")}>
          ← Retour à l’accueil
        </button>
        <img src="/MAP2-300.png" alt="Logo" height="60" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Statistiques de Trafic</h2>
        <select
          className="form-select w-auto"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="jour">Jour</option>
          <option value="semaine">Semaine</option>
          <option value="mois">Mois</option>
        </select>
      </div>

      <div className="row mb-4">
        {[
          { label: "Trajets en cours", value: stats.ongoingTrips },
          { label: "Incidents en cours", value: stats.ongoingIncidents },
          { label: "Durée moyenne", value: `${stats.averageTripDuration} min` },
          { label: "Distance moyenne", value: `${stats.averageTripDistance} km` },
        ].map((item, i) => (
          <div className="col-md-6" key={i}>
            <div className="card text-center mb-3">
              <div className="card-body">
                <h5>{item.label}</h5>
                <p className="display-6">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mb-5">
        <div className="col-md-6 offset-md-3">
          <div className="card p-3">
            <h5 className="text-center">Nouveaux vs Récurrents (Mock)</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { type: "Nouveaux", value: 60 },
                    { type: "Récurrents", value: 40 },
                  ]}
                  dataKey="value"
                  nameKey="type"
                  outerRadius={80}
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
