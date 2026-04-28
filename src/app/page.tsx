import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('resourceos_auth')?.value;
  
  if (!token) redirect('/login');

  try {
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-resourceos-key');
    await jwtVerify(token, SECRET);
  } catch(e) {
    redirect('/login');
  }

  // Fetch live data from Prisma
  const issues = await prisma.issue.findMany({
    where: { status: { not: 'RESOLVED' } }
  });

  const totalVolunteers = await prisma.volunteer.count();
  const onlineVolunteers = await prisma.volunteer.count({
    where: { status: 'ACTIVE' }
  });

  const activeMissions = await prisma.mission.count({
    where: { status: 'ACTIVE' }
  });

  const criticalMissions = await prisma.mission.count({
    where: { 
      status: 'ACTIVE',
      criticality: 'HIGH' 
    }
  });

  const resolvedToday = await prisma.mission.count({
    where: {
      status: 'COMPLETED',
      updatedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  const activeRequestsCount = issues.length;
  const criticalRequestsCount = issues.filter(i => i.priorityScore >= 80).length;

  const stats = {
    activeRequests: activeRequestsCount,
    criticalRequests: criticalRequestsCount,
    volunteersOnline: onlineVolunteers,
    totalVolunteers: totalVolunteers,
    resolvedToday: resolvedToday,
    activeMissions: activeMissions,
    criticalMissions: criticalMissions,
  };

  return <DashboardClient issues={issues} stats={stats} />;
}
