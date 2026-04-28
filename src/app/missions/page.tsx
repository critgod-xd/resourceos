import { TriangleAlert } from 'lucide-react';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import AssignButton from './AssignButton';

export const dynamic = 'force-dynamic';

export default async function Missions() {
  const missions = await prisma.mission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { volunteer: true }
  });

  const volunteers = await prisma.volunteer.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Active Missions</h1>
        <p className={styles.subtitle}>Track progress and assign volunteers to critical tasks.</p>
      </div>

      <div className={styles.missionsGrid}>
        {missions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active missions found.
          </div>
        ) : (
          missions.map(mission => (
            <div key={mission.id} className={`glass-panel ${styles.missionCard}`}>
              <div className={styles.missionInfo}>
                <div className={styles.missionTitle}>{mission.title}</div>
                <div className={`${styles.criticality} ${styles[mission.criticality]}`}>
                  {mission.criticality === 'HIGH' && <TriangleAlert size={12} />}
                  {mission.criticality} PRIORITY
                </div>
              </div>
              
              <div className={styles.missionProgress}>
                <div className={styles.progressHeader}>
                  <span>Completion</span>
                  <span>{mission.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${mission.progress}%`,
                      backgroundColor: mission.criticality === 'HIGH' ? 'var(--danger)' : 'var(--accent-amber)' 
                    }}
                  ></div>
                </div>
              </div>

              <div className={styles.missionActions}>
                <AssignButton 
                  missionId={mission.id} 
                  assignedVolunteerName={mission.volunteer?.name || null}
                  volunteers={volunteers}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
