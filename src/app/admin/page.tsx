"use client";

import { Globe, Package, Database, TrendingUp, Sparkles } from 'lucide-react';
import styles from './page.module.css';

const ngos = [
  { id: 'ngo1', initial: 'S', name: 'Seva Foundation', zones: 'North, West', volunteers: 24, missions: 34, status: 'ACTIVE' },
  { id: 'ngo2', initial: 'H', name: 'Hope Collective', zones: 'South', volunteers: 18, missions: 28, status: 'ACTIVE' },
  { id: 'ngo3', initial: 'Z', name: 'Zakat Relief', zones: 'East', volunteers: 9, missions: 15, status: 'ACTIVE' },
  { id: 'ngo4', initial: 'G', name: 'GreenAid India', zones: 'West', volunteers: 12, missions: 19, status: 'PENDING' },
  { id: 'ngo5', initial: 'R', name: 'Rural Connect', zones: 'All Zones', volunteers: 31, missions: 47, status: 'ACTIVE' },
];

const resources = [
  { name: 'Food Packets', total: 1500, used: 1240, color: '#f59e0b' },
  { name: 'Medical Kits', total: 120, used: 84, color: '#ef4444' },
];

export default function Admin() {
  return (
    <div className="animate-fade-in">
      <div className={styles.adminHeader}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Partner NGOs <Globe size={16} className={styles.iconBlue} />
          </div>
          <div className={styles.statValue}>
            12 <span className={styles.statTrend}>↑ +2</span>
          </div>
          <div className={styles.statSubtext}>across 3 states</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Resources Donated <Package size={16} className={styles.iconGreen} />
          </div>
          <div className={styles.statValue}>
            ₹4.2L <span className={styles.statTrend}>↑ +34%</span>
          </div>
          <div className={styles.statSubtext}>this quarter</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Total Impact <Database size={16} className={styles.iconAmber} />
          </div>
          <div className={styles.statValue}>
            2,840 <span className={styles.statTrend}>↑ +180</span>
          </div>
          <div className={styles.statSubtext}>people helped</div>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            Resolution Rate <TrendingUp size={16} className={styles.iconRed} />
          </div>
          <div className={styles.statValue}>
            84% 
          </div>
          <div className={styles.statSubtext}>+6% vs last month</div>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <div className={`glass-panel ${styles.sectionPanel}`}>
          <div className={styles.sectionTitle}>Partner Organizations</div>
          <div className={styles.ngoList}>
            {ngos.map(ngo => (
              <div key={ngo.id} className={styles.ngoRow}>
                <div className={styles.ngoIcon}>{ngo.initial}</div>
                <div className={styles.ngoInfo}>
                  <div className={styles.ngoName}>{ngo.name}</div>
                  <div className={styles.ngoZones}>{ngo.zones}</div>
                </div>
                <div className={styles.ngoStats}>
                  <div>
                    <div className={styles.ngoStatValue}>{ngo.volunteers}</div>
                    <div className={styles.ngoStatLabel}>Volunteers</div>
                  </div>
                  <div>
                    <div className={styles.ngoStatValue}>{ngo.missions}</div>
                    <div className={styles.ngoStatLabel}>Missions</div>
                  </div>
                </div>
                <div className={`${styles.ngoStatus} ${ngo.status === 'ACTIVE' ? styles.statusActive : styles.statusPending}`}>
                  {ngo.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={`glass-panel ${styles.sectionPanel}`}>
            <div className={styles.sectionTitle}>Resource & Donation Tracker</div>
            {resources.map(res => (
              <div key={res.name} className={styles.resourceItem}>
                <div className={styles.resourceHeader}>
                  <span>{res.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{res.used} / {res.total}</span>
                </div>
                <div className={styles.resourceTrack}>
                  <div 
                    className={styles.resourceFill} 
                    style={{ 
                      width: `${(res.used / res.total) * 100}%`,
                      backgroundColor: res.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className={`glass-panel ${styles.sectionPanel} ${styles.predictionPanel}`}>
            <div className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)' }}>
              <Sparkles size={14} /> AI 7-Day Prediction
            </div>
            <div className={styles.predictionList}>
              <div className={`${styles.predictionItem} ${styles.critical}`}>
                <div className={styles.predictionText}>
                  <strong>High Probability:</strong> Medical supply shortage expected in Sector 4 within 48 hours based on current mission burn rate.
                </div>
              </div>
              <div className={styles.predictionItem}>
                <div className={styles.predictionText}>
                  <strong>Trend Alert:</strong> Shelter requests in East Zone increasing 15% daily. Pre-allocate 5 additional volunteers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
