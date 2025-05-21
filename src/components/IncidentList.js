import React, { useState, useEffect } from 'react';

function IncidentList({ incidents, setIncidents }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) throw new Error('Failed to fetch incidents');
        const data = await response.json();
        // Transform the data to match our incident format
        const formattedData = data.map(post => ({
          id: post.id,
          title: post.title,
          location: 'Unknown Location',
          severity: 'Medium',
          timestamp: new Date().toISOString()
        }));
        setIncidents(prevIncidents => {
          // Only add new incidents if we don't have any stored ones
          if (prevIncidents.length === 0) {
            return formattedData;
          }
          return prevIncidents;
        });
        setError(null);
      } catch (err) {
        setError('Failed to load recent incidents');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have any incidents yet
    if (incidents.length === 0) {
      fetchIncidents();
    } else {
      setLoading(false);
    }
  }, [setIncidents, incidents.length]);

  if (loading) return <div className="loading">Loading recent incidents...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="incident-list">
      <h2>Recent Batcomputer Logs</h2>
      {incidents.length === 0 ? (
        <p>No recent incidents reported.</p>
      ) : (
        <ul>
          {incidents.map(incident => (
            <li key={incident.id} className="incident-item">
              <h3>{incident.title}</h3>
              <p>{incident.location} - Severity: {incident.severity}</p>
              {incident.villainSpotted && incident.villainName && (
                <p className="villain-info">Villain: {incident.villainName}</p>
              )}
              <p className="timestamp">Reported: {new Date(incident.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IncidentList; 