import React, { useState, useEffect } from 'react';
import './App.css';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';

function App() {
  // Initialize state from localStorage or empty array
  const [incidents, setIncidents] = useState(() => {
    const savedIncidents = localStorage.getItem('batIncidents');
    return savedIncidents ? JSON.parse(savedIncidents) : [];
  });

  // Save to localStorage whenever incidents change
  useEffect(() => {
    localStorage.setItem('batIncidents', JSON.stringify(incidents));
  }, [incidents]);

  const addIncident = (newIncident) => {
    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Batcomputer Incident Report</h1>
      </header>
      <main>
        <IncidentForm onIncidentAdded={addIncident} />
        <IncidentList incidents={incidents} setIncidents={setIncidents} />
      </main>
    </div>
  );
}

export default App; 