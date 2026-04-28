"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';
import { submitReport } from '../actions';

const needTypes = ['Medical', 'Food', 'Shelter', 'Water', 'Education', 'Clothing', 'Sanitation', 'Other'];

export default function ReportIssue() {
  const [selectedType, setSelectedType] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState(5);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [priorityScore, setPriorityScore] = useState(0);

  // Simple heuristic for AI Priority Score MVP
  const calculateScore = () => {
    let score = urgency * 8; // Max 80 from urgency
    if (['Medical', 'Water', 'Shelter'].includes(selectedType)) score += 15;
    if (description.toLowerCase().includes('immediate') || description.toLowerCase().includes('critical')) score += 5;
    return Math.min(score, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate final score
    const finalScore = calculateScore();
    setPriorityScore(finalScore);

    // Call Server Action
    const result = await submitReport({
      needType: selectedType,
      location,
      urgency,
      description,
      contact,
      priorityScore: finalScore
    });

    if (result.success) {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset after showing success for 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedType('');
        setLocation('');
        setUrgency(5);
        setDescription('');
        setContact('');
      }, 3000);
    } else {
      setIsSubmitting(false);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Report a Community Need</h1>
        <p className={styles.subtitle}>
          Your request will be prioritized by our AI scoring engine and matched with the nearest available volunteer.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
        {showSuccess && (
          <div className={styles.successOverlay}>
            <CheckCircle2 size={64} className={styles.successIcon} />
            <h2 className={styles.successTitle}>Request Submitted</h2>
            <div className={styles.successScore}>AI Priority Score: {priorityScore}/100</div>
            <p style={{ color: 'var(--text-muted)' }}>Matching with volunteers now...</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Need Type *</label>
            <div className={styles.needTypeGrid}>
              {needTypes.map(type => (
                <button
                  type="button"
                  key={type}
                  className={`${styles.needChip} ${selectedType === type ? styles.selected : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Location / Sector *</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Sector 4, Ward 12, or describe area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.urgencyHeader}>
              <label className={styles.label} style={{ marginBottom: 0 }}>Urgency Level: </label>
              <span className={styles.urgencyValue}>{urgency}/10</span>
            </div>
            <div className={styles.sliderContainer}>
              <input 
                type="range" 
                min="1" max="10" 
                value={urgency} 
                onChange={(e) => setUrgency(parseInt(e.target.value))}
                className={styles.slider}
                style={{ background: `linear-gradient(to right, var(--accent-amber) ${urgency * 10}%, var(--bg-dark) ${urgency * 10}%)` }}
              />
            </div>
            <div className={styles.sliderLabels}>
              <span>Low — can wait</span>
              <span>Critical — life risk</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Describe the situation in detail — number of people affected, what's immediately needed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact (Optional)</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Phone number or name"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={`amber-btn ${styles.submitBtn}`}
            disabled={!selectedType || !location || !description || isSubmitting}
          >
            {isSubmitting ? 'Processing with AI...' : 'Submit Request'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
