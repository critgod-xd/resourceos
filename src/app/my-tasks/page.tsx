import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { assignMission } from '../actions';
import MissionActions from './MissionActions';

export const dynamic = 'force-dynamic';

export default async function MyTasks() {
  const cookieStore = await cookies();
  const token = cookieStore.get('resourceos_auth')?.value;
  
  if (!token) redirect('/login');

  let userId = '';
  try {
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-resourceos-key');
    const verified = await jwtVerify(token, SECRET);
    userId = verified.payload.id as string;
  } catch(e) {
    redirect('/login');
  }

  // Get volunteer info based on the userId
  const volunteer = await prisma.volunteer.findUnique({
    where: { userId },
    include: {
      missions: {
        orderBy: { updatedAt: 'desc' }
      }
    }
  });

  if (!volunteer) {
    return <div className="glass-panel" style={{ padding: '2rem' }}>Error: Volunteer profile not found.</div>;
  }

  const activeMissions = volunteer.missions.filter(m => m.status === 'ACTIVE');
  const pastMissions = volunteer.missions.filter(m => m.status === 'COMPLETED');

  // Also fetch 3 open missions that don't have a volunteer assigned yet
  const openMissions = await prisma.mission.findMany({
    where: { volunteerId: null, status: 'ACTIVE' },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back, {volunteer.name}</h1>
        <p className={styles.subtitle}>Tier: {volunteer.tier} • Missions Completed: {pastMissions.length}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Current Assignments</h2>
          {activeMissions.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              You have no active assignments right now. Check out available missions below!
            </div>
          ) : (
            activeMissions.map(mission => (
              <div key={mission.id} className={`glass-panel ${styles.missionCard}`}>
                <div className={styles.missionHeader}>
                  <div>
                    <div className={styles.missionTitle}>{mission.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Clock size={14} /> Assigned recently
                    </div>
                  </div>
                  <div className={`${styles.criticality} ${styles[mission.criticality]}`}>
                    {mission.criticality} PRIORITY
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span>Progress</span>
                    <span>{mission.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${mission.progress}%` }}></div>
                  </div>
                </div>

                <MissionActions 
                  missionId={mission.id} 
                  volunteerId={volunteer.id} 
                  currentProgress={mission.progress} 
                />
              </div>
            ))
          )}

          <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Available Open Missions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {openMissions.length === 0 ? (
              <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No unassigned missions currently.</div>
            ) : (
              openMissions.map(mission => {
                const claimAction = assignMission.bind(null, mission.id, volunteer.id);
                return (
                  <div key={mission.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{mission.title}</div>
                      <div className={`${styles.criticality} ${styles[mission.criticality]}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                        {mission.criticality} PRIORITY
                      </div>
                    </div>
                    <form action={claimAction}>
                      <button type="submit" className="amber-btn" style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '0.875rem' }}>Claim</button>
                    </form>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Mission History</h2>
          <div className="glass-panel" style={{ padding: '1rem' }}>
            {pastMissions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                You haven't completed any missions yet.
              </div>
            ) : (
              pastMissions.map(mission => (
                <div key={mission.id} className={styles.historyItem}>
                  <div className={styles.historyTitle}>{mission.title}</div>
                  <div className={styles.historyDate}>Completed recently</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
