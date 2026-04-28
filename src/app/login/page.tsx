"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import styles from './page.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === 'VOLUNTEER') {
          router.push('/my-tasks');
        } else {
          router.push('/');
        }
        router.refresh(); // Refresh to update layout state
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.loginCard} animate-fade-in`}>
        <div>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span>ResourceOS.</span>
          </div>
          <h1 className={styles.title}>Command Center Login</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input 
              type="text" 
              className={styles.input} 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`amber-btn ${styles.submitBtn}`}
            disabled={isLoading || !username || !password}
          >
            {isLoading ? 'Authenticating...' : 'Access Command Center'} <LogIn size={18} />
          </button>
        </form>

        <div className={styles.demoInfo}>
          <p>Demo Admin Credentials:</p>
          <p><strong>Username:</strong> admin | <strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
}
