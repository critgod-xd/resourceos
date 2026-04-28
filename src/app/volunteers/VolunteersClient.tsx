"use client";

import { useState } from 'react';
import { Users, Activity, Star, Award } from 'lucide-react';
import styles from './page.module.css';

interface Volunteer {
  id: string;
  name: string;
  tier: string;
  skills: string;
  rating: number;
  missionsCount: number;
  status: string;
}

export default function VolunteersClient({ volunteers }: { volunteers: Volunteer[] }) {
  const [filter, setFilter] = useState('All');

  const filteredVolunteers = filter === 'All' 
    ? volunteers 
    : volunteers.filter(v => v.status === filter.toUpperCase());

  const activeCount = volunteers.filter(v => v.status === 'BUSY' || v.status === 'ACTIVE').length;
  const totalMissions = volunteers.reduce((sum, v) => sum + v.missionsCount, 0);

  const skillAvailability = [
    { name: 'Medical / First Aid', count: volunteers.filter(v => v.skills.includes('Medical')).length, max: volunteers.length, color: '#ef4444' },
    { name: 'Food & Nutrition', count: volunteers.filter(v => v.skills.includes('Food')).length, max: volunteers.length, color: '#f59e0b' },
    { name: 'Shelter & Logistics', count: volunteers.filter(v => v.skills.includes('Shelter')).length, max: volunteers.length, color: '#3b82f6' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVolName, setNewVolName] = useState('');
  const [newVolSkills, setNewVolSkills] = useState('');
  const [newVolTier, setNewVolTier] = useState('BRONZE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // We need to dynamically import the action so we don't mix server/client module edges poorly,
    // or we can just assume Next.js handles server action imports correctly.
    // Assuming `createVolunteer` is imported at the top.
    const { createVolunteer } = await import('../actions');
    const result = await createVolunteer({
      name: newVolName,
      skills: newVolSkills,
      tier: newVolTier
    });

    if (result.success) {
      setIsModalOpen(false);
      setNewVolName('');
      setNewVolSkills('');
      setNewVolTier('BRONZE');
    } else {
      alert("Failed to create volunteer");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.volunteersHeader}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Total Volunteers <Users size={16} className={styles.iconGreen} />
          </div>
          <div className={styles.statValue}>
            {volunteers.length}
          </div>
          <div className={styles.statSubtext}>registered</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Active Now <Activity size={16} className={styles.iconAmber} />
          </div>
          <div className={styles.statValue}>
            {activeCount}
          </div>
          <div className={styles.statSubtext}>in the field</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Avg Rating <Star size={16} className={styles.iconBlue} />
          </div>
          <div className={styles.statValue}>
            4.8
          </div>
          <div className={styles.statSubtext}>across all volunteers</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Missions Done <Award size={16} className={styles.iconRed} />
          </div>
          <div className={styles.statValue}>
            {totalMissions}
          </div>
          <div className={styles.statSubtext}>this month</div>
        </div>
      </div>

      <div className={styles.filters} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {['All', 'Active', 'Busy', 'Offline'].map(f => (
            <button 
              key={f} 
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button 
          className="amber-btn" 
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Volunteer
        </button>
      </div>

      <div className={styles.volunteersGrid}>
        {filteredVolunteers.map(volunteer => {
          const initials = volunteer.name.split(' ').map(n => n[0]).join('').substring(0, 2);
          const skillsList = volunteer.skills.split(',').map(s => s.trim()).filter(Boolean);

          return (
            <div key={volunteer.id} className={`glass-panel ${styles.volunteerCard}`}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{volunteer.name}</span>
                    <span className={`${styles.badge} ${styles[volunteer.tier]}`}>{volunteer.tier}</span>
                  </div>
                  <div className={styles.ratingRow}>
                    <div className={styles.rating}>
                      <Star size={14} fill="currentColor" /> {volunteer.rating}
                    </div>
                    <div className={styles.missionsCount}>{volunteer.missionsCount} missions</div>
                  </div>
                </div>
                <div className={styles.skillsRow}>
                  {skillsList.map(skill => (
                    <span key={skill} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
                <div className={`${styles.statusRow} ${styles.status} ${styles[volunteer.status]}`}>
                  <div className={styles.statusIndicator}></div>
                  {volunteer.status}
                </div>
              </div>
            </div>
          );
        })}
        {filteredVolunteers.length === 0 && (
          <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>No volunteers found.</div>
        )}
      </div>

      <div className={`glass-panel ${styles.trackerSection}`}>
        <div className={styles.trackerTitle}>Skill Availability</div>
        {skillAvailability.map(skill => (
          <div key={skill.name} className={styles.skillBarContainer}>
            <div className={styles.skillBarHeader}>
              <span>{skill.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{skill.count} available</span>
            </div>
            <div className={styles.skillTrack}>
              <div 
                className={styles.skillFill} 
                style={{ 
                  width: skill.max > 0 ? `${(skill.count / skill.max) * 100}%` : '0%',
                  backgroundColor: skill.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add Volunteer</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name</label>
                <input 
                  type="text" 
                  value={newVolName}
                  onChange={(e) => setNewVolName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Skills (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="Medical, Food, Rescue"
                  value={newVolSkills}
                  onChange={(e) => setNewVolSkills(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Tier</label>
                <select 
                  value={newVolTier}
                  onChange={(e) => setNewVolTier(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff' }}
                >
                  <option value="BRONZE">BRONZE</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="PLATINUM">PLATINUM</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="amber-btn" 
                style={{ padding: '12px', borderRadius: '6px', marginTop: '8px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Volunteer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
