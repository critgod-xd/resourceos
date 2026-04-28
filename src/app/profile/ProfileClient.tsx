"use client";

import { useState } from 'react';
import { updatePassword } from '../actions';
import { User, Shield, Award, Key } from 'lucide-react';

export default function ProfileClient({
  userId,
  username,
  role,
  volunteerDetails
}: {
  userId: string;
  username: string;
  role: string;
  volunteerDetails: any;
}) {
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    const result = await updatePassword(userId, newPassword);
    if (result.success) {
      setMessage('Password updated successfully!');
      setNewPassword('');
    } else {
      setMessage('Failed to update password.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account settings and preferences.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-amber)' }}>
            {(username || role || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{volunteerDetails?.name || 'System Administrator'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>@{username || 'admin'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Role</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              {role === 'ADMIN' ? <Shield size={16} color="var(--accent-amber)" /> : <User size={16} color="var(--success)" />}
              {role || 'Unknown'}
            </div>
          </div>

          {volunteerDetails && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Tier</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                <Award size={16} color="var(--info)" />
                {volunteerDetails.tier || 'BRONZE'}
              </div>
            </div>
          )}
        </div>

        {volunteerDetails && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Registered Skills</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(volunteerDetails.skills || 'General').split(',').map((s: string) => s.trim()).map((skill: string) => (
                <span key={skill} style={{ padding: '4px 8px', backgroundColor: 'var(--bg-panel)', borderRadius: '4px', fontSize: '0.875rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} /> Security Settings
        </h2>
        
        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff' }}
              required
              minLength={6}
            />
          </div>
          
          {message && (
            <div style={{ padding: '10px', backgroundColor: message.includes('success') ? 'var(--success)' : 'var(--danger)', color: '#fff', borderRadius: '4px', fontSize: '0.875rem' }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="amber-btn" 
            disabled={isSubmitting || !newPassword}
            style={{ padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 600, alignSelf: 'flex-start' }}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
