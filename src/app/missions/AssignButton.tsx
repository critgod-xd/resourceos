"use client";

import { useState } from 'react';
import { assignMission } from '../actions';
import styles from './page.module.css';

interface Volunteer {
  id: string;
  name: string;
  status: string;
}

export default function AssignButton({ 
  missionId, 
  assignedVolunteerName,
  volunteers 
}: { 
  missionId: string, 
  assignedVolunteerName: string | null,
  volunteers: Volunteer[] 
}) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (assignedVolunteerName) {
    return (
      <div style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: '600' }}>
        Assigned to: {assignedVolunteerName}
      </div>
    );
  }

  const handleAssign = async (volunteerId: string) => {
    setIsAssigning(true);
    setIsOpen(false);
    await assignMission(missionId, volunteerId);
    setIsAssigning(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className={styles.assignBtn} 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isAssigning}
      >
        {isAssigning ? 'Assigning...' : 'Assign Team'}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-panel)',
          zIndex: 10,
          width: '200px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {volunteers.map(v => (
            <button
              key={v.id}
              onClick={() => handleAssign(v.id)}
              disabled={v.status === 'BUSY' || v.status === 'OFFLINE'}
              style={{
                width: '100%',
                padding: '10px 12px',
                textAlign: 'left',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: (v.status === 'BUSY' || v.status === 'OFFLINE') ? 'var(--text-muted)' : 'var(--text-main)',
                cursor: (v.status === 'BUSY' || v.status === 'OFFLINE') ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem'
              }}
            >
              <span>{v.name}</span>
              <span style={{ fontSize: '0.75rem', color: v.status === 'ACTIVE' ? 'var(--success)' : 'inherit' }}>
                {v.status}
              </span>
            </button>
          ))}
          {volunteers.length === 0 && (
            <div style={{ padding: '10px 12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              No volunteers available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
