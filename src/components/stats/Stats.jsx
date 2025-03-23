// src/pages/TrafficStatsPage.tsx
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
  } from "recharts";
  import { useNavigate } from "react-router-dom";
  import { useState } from "react";
  
  const COLORS = ["#007bff", "#28a745"];
  
  const mockStats = {
    sessions: 3025,
    users: 2112,
    incidents: 7318,
    pagesPerSession: 5.42,
    avgSessionTime: "00:02:25",
    bounceRate: 39.23,
    visitorPie: [
      { type: "New Visitor", value: 68.1 },
      { type: "Returning Visitor", value: 31.9 }
    ],
    trafficByWeek: [
      { week: "2024-04-01", sessions: 120 },
      { week: "2024-04-08", sessions: 170 },
      { week: "2024-04-15", sessions: 140 },
      { week: "2024-04-22", sessions: 180 },
      { week: "2024-05-01", sessions: 220 },
      { week: "2024-05-08", sessions: 300 },
      { week: "2024-05-15", sessions: 160 },
      { week: "2024-05-22", sessions: 100 },
      { week: "2024-06-01", sessions: 130 },
      { week: "2024-06-08", sessions: 150 },
      { week: "2024-06-15", sessions: 170 },
    ]
  };
  
  const Stats = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState("semaine");
  
    const stats = mockStats;
  
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
            className="form-select d-inline-block w-auto"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="jour">Jour</option>
            <option value="semaine">Semaine</option>
            <option value="mois">Mois</option>
          </select>
        </div>
  
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card text-center mb-3">
              <div className="card-body">
                <h5>Sessions</h5>
                <p className="display-6">{stats.sessions}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center mb-3">
              <div className="card-body">
                <h5>Utilisateurs</h5>
                <p className="display-6">{stats.users}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center mb-3">
              <div className="card-body">
                <h5>Signalements</h5>
                <p className="display-6">{stats.incidents}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center mb-3">
              <div className="card-body">
                <h5>Pages / Session</h5>
                <p className="display-6">{stats.pagesPerSession}</p>
              </div>
            </div>
          </div>
        </div>
  
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h6>Durée Moyenne</h6>
                <p className="h4">{stats.avgSessionTime}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h6>Taux de rebond</h6>
                <p className="h4">{stats.bounceRate} %</p>
              </div>
            </div>
          </div>
        </div>
  
        <div className="row mb-4">
          <div className="col-12">
            <div className="card p-3">
              <h5 className="text-center">Trafic par {period}</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.trafficByWeek}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sessions" stroke="#007bff" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  
        <div className="row mb-5">
          <div className="col-md-6 offset-md-3">
            <div className="card p-3">
              <h5 className="text-center">Nouveaux vs Récurrents</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.visitorPie} dataKey="value" nameKey="type" outerRadius={80}>
                    {stats.visitorPie.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
  