"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Activity, Map, Users, Shield, PlusCircle, Bell, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ userRole = 'ADMIN' }: { userRole?: string }) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hide navbar on login page
  if (pathname === '/login') return null;

  const adminLinks = [
    { name: 'Dashboard', href: '/', icon: <Activity size={16} /> },
    { name: 'Report Issue', href: '/report', icon: <PlusCircle size={16} /> },
    { name: 'Volunteers', href: '/volunteers', icon: <Users size={16} /> },
    { name: 'Missions', href: '/missions', icon: <Map size={16} /> },
    { name: 'Admin', href: '/admin', icon: <Shield size={16} /> },
  ];

  const volunteerLinks = [
    { name: 'My Tasks', href: '/my-tasks', icon: <Map size={16} /> },
    { name: 'Report Issue', href: '/report', icon: <PlusCircle size={16} /> },
  ];

  const navLinks = userRole === 'VOLUNTEER' ? volunteerLinks : adminLinks;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>⚡</div>
        <span>ResourceOS.</span>
      </div>

      <div className={styles.navLinks}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className={styles.navActions}>
        <button className={styles.iconBtn} onClick={() => setNotifications(0)}>
          <Bell size={18} />
          {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
        </button>
        <div style={{ position: 'relative' }}>
          <button 
            className={styles.avatar} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {userRole === 'ADMIN' ? 'A' : 'V'}
          </button>
          
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-panel)',
              zIndex: 50,
              width: '150px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  window.location.href = '/profile';
                }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  color: 'var(--text-main)',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                My Profile
              </button>
              <button 
                onClick={async () => {
                  const { logoutUser } = await import('../app/actions');
                  await logoutUser();
                  window.location.href = '/login';
                }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  color: 'var(--danger)',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
