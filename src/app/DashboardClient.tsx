"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';
import { TriangleAlert, Users, CheckCircle2, Target, Radio } from 'lucide-react';
import styles from './page.module.css';

const activityData = [
  { name: 'Mon', requests: 12, resolved: 8 },
  { name: 'Tue', requests: 19, resolved: 15 },
  { name: 'Wed', requests: 15, resolved: 18 },
  { name: 'Thu', requests: 28, resolved: 22 },
  { name: 'Fri', requests: 22, resolved: 25 },
  { name: 'Sat', requests: 35, resolved: 30 },
  { name: 'Sun', requests: 30, resolved: 28 },
];

const zoneData = [
  { name: 'North', value: 24 },
  { name: 'South', value: 30 },
  { name: 'East', value: 42 },
  { name: 'West', value: 38 },
];

const needData = [
  { name: 'Medical', value: 31, color: '#ef4444' },
  { name: 'Food', value: 28, color: '#f59e0b' },
  { name: 'Shelter', value: 18, color: '#8b5cf6' },
  { name: 'Water', value: 13, color: '#06b6d4' },
  { name: 'Other', value: 10, color: '#3b82f6' },
];

// Hash function to turn location string into stable X/Y map coordinates
function getCoordinates(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // 10-90 range to keep pins inside the map container nicely
  const x = 10 + (Math.abs(hash) % 80);
  const y = 10 + (Math.abs(hash >> 3) % 80);
  return { x, y };
}

export default function DashboardClient({
  issues,
  stats
}: {
  issues: any[];
  stats: {
    activeRequests: number;
    criticalRequests: number;
    volunteersOnline: number;
    totalVolunteers: number;
    resolvedToday: number;
    activeMissions: number;
    criticalMissions: number;
  };
}) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('resourceos_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setShowPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('resourceos_popup_seen', 'true');
  };

  const mapPins = issues.filter(i => i.status !== 'RESOLVED').map(issue => {
    const coords = getCoordinates(issue.location);
    return {
      id: issue.id,
      x: coords.x,
      y: coords.y,
      label: issue.location.substring(0, 3).toUpperCase(),
      status: issue.priorityScore >= 80 ? 'urgent' : 'active'
    };
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.dashboardGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Active Requests <TriangleAlert size={16} className={styles.iconRed} />
          </div>
          <div className={styles.statValue}>
            {stats.activeRequests} <span className={styles.statTrend}>Live</span>
          </div>
          <div className={styles.statSubtext}>{stats.criticalRequests} critical right now</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Volunteers Online <Users size={16} className={styles.iconGreen} />
          </div>
          <div className={styles.statValue}>
            {stats.volunteersOnline}
          </div>
          <div className={styles.statSubtext}>of {stats.totalVolunteers} registered</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Resolved Today <CheckCircle2 size={16} className={styles.iconBlue} />
          </div>
          <div className={styles.statValue}>
            {stats.resolvedToday}
          </div>
          <div className={styles.statSubtext}>total cleared</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Active Missions <Target size={16} className={styles.iconAmber} />
          </div>
          <div className={styles.statValue}>
            {stats.activeMissions}
          </div>
          <div className={styles.statSubtext}>{stats.criticalMissions} critical status</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.chartTitle}>Weekly Activity</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #2e3340', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="requests" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.chartTitle}>Requests by Zone</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={zoneData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1a1d24', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.chartTitle}>Need Breakdown</div>
          <div style={{ display: 'flex', alignItems: 'center', height: '200px' }}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={needData}
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {needData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              {needData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                    <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: '600' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`glass-panel ${styles.mapSection}`}>
        <div className={styles.mapTitle}>
          <span>Live Field Map — Synchronized</span>
          <span className={styles.liveIndicator}><Radio size={14} /> LIVE</span>
        </div>
        <div className={styles.simulatedMap}>
          {mapPins.map(pin => (
            <div key={pin.id} style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%` }}>
              <div className={`${styles.pin} ${styles[pin.status]}`}></div>
              <div className={styles.pinLabel}>{pin.label}</div>
            </div>
          ))}
          {mapPins.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)' }}>
              No active issues to map.
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '10px', right: '20px', display: 'flex', gap: '15px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></div>
              critical
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)' }}></div>
              active
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1a1d24',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '20px',
          width: '320px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          animation: 'fade-in 0.3s ease-out',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>
              <TriangleAlert size={18} />
              URGENT ALERT
            </div>
            <button onClick={dismissPopup} style={{ color: '#94a3b8' }}>✕</button>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#f8fafc', marginBottom: '15px' }}>
            Water contamination reported in Sector 6 — 200+ residents affected. Immediate response required.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={dismissPopup}
              style={{ flex: 1, backgroundColor: '#ef4444', color: '#fff', padding: '8px', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}
            >
              Accept
            </button>
            <button 
              onClick={dismissPopup}
              style={{ flex: 1, backgroundColor: '#2e3340', color: '#f8fafc', padding: '8px', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
