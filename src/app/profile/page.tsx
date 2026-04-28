import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('resourceos_auth')?.value;
  
  if (!token) redirect('/login');

  let userId = '';
  let role = '';
  let username = '';
  try {
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-resourceos-key');
    const verified = await jwtVerify(token, SECRET);
    userId = verified.payload.id as string;
    role = verified.payload.role as string;
    username = verified.payload.username as string;
  } catch(e) {
    redirect('/login');
  }

  // Fetch volunteer details if the user is a volunteer
  let volunteerDetails = null;
  if (role === 'VOLUNTEER') {
    volunteerDetails = await prisma.volunteer.findUnique({
      where: { userId }
    });
  }

  return (
    <ProfileClient 
      userId={userId} 
      username={username} 
      role={role} 
      volunteerDetails={volunteerDetails} 
    />
  );
}
