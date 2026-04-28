import { prisma } from '@/lib/prisma';
import VolunteersClient from './VolunteersClient';

export const dynamic = 'force-dynamic';

export default async function Volunteers() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { name: 'asc' }
  });

  return <VolunteersClient volunteers={volunteers} />;
}
