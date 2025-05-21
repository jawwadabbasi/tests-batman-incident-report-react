import React, { useState } from 'react';

function IncidentForm({ onIncidentAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    villainName: '',
    severity: '',
    notes: '',
    villainSpotted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      villainName: '',
      severity: '',
      notes: '',
      villainSpotted: false
    });
    setSubmitStatus(null);
  };

  const isFormValid = () => {
    return formData.title && formData.location && formData.severity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Create a new incident object combining the form data and response data
        const newIncident = {
          ...formData,
          id: data.id || Date.now(), // Use the server's ID or generate one
          timestamp: new Date().toISOString()
        };
        onIncidentAdded(newIncident);
        setSubmitStatus('success');
        resetForm();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="incident-form">
      <h2>Submit New Incident</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Incident Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="villainSpotted"
              checked={formData.villainSpotted}
              onChange={handleChange}
            />
            Villain Spotted
          </label>
        </div>

        {formData.villainSpotted && (
          <div className="form-group">
            <label htmlFor="villainName">Villain Name</label>
            <input
              type="text"
              id="villainName"
              name="villainName"
              value={formData.villainName}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="severity">Severity *</label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
          >
            <option value="">Select Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="reset-btn"
          >
            Reset Form
          </button>
        </div>
      </form>

      {submitStatus === 'success' && (
        <div className="success-message">Incident report submitted successfully!</div>
      )}
      {submitStatus === 'error' && (
        <div className="error-message">Failed to submit incident report. Please try again.</div>
      )}
    </div>
  );
}

export default IncidentForm; 