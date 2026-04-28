"use client";

import { useState } from 'react';
import { updateMissionProgress, completeMission } from '../actions';
import { CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function MissionActions({ missionId, volunteerId, currentProgress }: { missionId: string, volunteerId: string, currentProgress: number }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProgress = async () => {
    // Increase progress by 25% for demo purposes, capping at 99% (since 100% is 'Complete')
    const newProgress = Math.min(currentProgress + 25, 99);
    setIsUpdating(true);
    await updateMissionProgress(missionId, newProgress);
    setIsUpdating(false);
  };

  const handleComplete = async () => {
    if (!window.confirm("Are you sure you want to mark this mission as complete?")) return;
    setIsUpdating(true);
    await completeMission(missionId, volunteerId);
    setIsUpdating(false);
  };

  return (
    <div className={styles.missionActions}>
      <button 
        className="amber-btn" 
        style={{ flex: 1, padding: '8px', fontSize: '0.875rem', borderRadius: '4px' }}
        onClick={handleUpdateProgress}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Update Progress (+25%)'}
      </button>
      <button 
        style={{ flex: 1, padding: '8px', fontSize: '0.875rem', borderRadius: '4px', backgroundColor: 'var(--success)', color: '#fff', fontWeight: 'bold', border: 'none', cursor: isUpdating ? 'not-allowed' : 'pointer' }}
        onClick={handleComplete}
        disabled={isUpdating}
      >
        <CheckCircle size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
        Complete
      </button>
    </div>
  );
}
