const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log({ admin });

  // Clear existing data
  await prisma.volunteer.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.partnerNGO.deleteMany();

  // Create Volunteers
  const volunteersData = [
    { id: 'v1', name: 'Priya Mehta', tier: 'GOLD', skills: 'Medical,First Aid', rating: 4.9, missionsCount: 34, status: 'ACTIVE' },
    { id: 'v2', name: 'Anjali Singh', tier: 'GOLD', skills: 'Education,Counseling', rating: 4.8, missionsCount: 28, status: 'BUSY' },
    { id: 'v3', name: 'Meera Nair', tier: 'PLATINUM', skills: 'Medical,Nutrition', rating: 5.0, missionsCount: 45, status: 'OFFLINE' },
    { id: 'v4', name: 'Rahul Kumar', tier: 'SILVER', skills: 'Transport,Food', rating: 4.7, missionsCount: 22, status: 'ACTIVE' },
    { id: 'v5', name: 'Dev Patel', tier: 'SILVER', skills: 'Shelter,Logistics', rating: 4.6, missionsCount: 18, status: 'ACTIVE' },
    { id: 'v6', name: 'Arjun Das', tier: 'BRONZE', skills: 'Water,Sanitation', rating: 4.5, missionsCount: 12, status: 'ACTIVE' },
  ];

  for (const v of volunteersData) {
    const username = v.name.toLowerCase().replace(/\s+/g, '');
    const passwordHash = await bcrypt.hash(`${username}@123`, 10);
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: 'VOLUNTEER'
      }
    });
    await prisma.volunteer.create({
      data: {
        id: v.id,
        userId: user.id,
        name: v.name,
        tier: v.tier,
        skills: v.skills,
        rating: v.rating,
        missionsCount: v.missionsCount,
        status: v.status
      }
    });
  }

  // Create Missions
  await prisma.mission.createMany({
    data: [
      { id: 'm1', title: 'Medical Supply Drop - North Zone', progress: 80, criticality: 'HIGH', status: 'ACTIVE' },
      { id: 'm2', title: 'Water Distribution - Sector 6', progress: 45, criticality: 'HIGH', status: 'ACTIVE' },
      { id: 'm3', title: 'Shelter Setup - East Zone', progress: 95, criticality: 'MEDIUM', status: 'ACTIVE' },
      { id: 'm4', title: 'Food Delivery - South Zone', progress: 20, criticality: 'LOW', status: 'ACTIVE' },
      { id: 'm5', title: 'Evacuation Assistance - Ward 12', progress: 60, criticality: 'HIGH', status: 'ACTIVE' },
    ]
  });

  // Create Issues
  await prisma.issue.createMany({
    data: [
      { id: 'i1', needType: 'Water', location: 'Sector 6', urgency: 8, description: 'Water contamination reported.', priorityScore: 85, status: 'PENDING' },
      { id: 'i2', needType: 'Medical', location: 'Sector 4', urgency: 9, description: 'Immediate medical assistance required.', priorityScore: 92, status: 'IN_PROGRESS' },
    ]
  });

  // Create Resources
  await prisma.resource.createMany({
    data: [
      { id: 'r1', type: 'Food Packets', total: 1500, used: 1240 },
      { id: 'r2', type: 'Medical Kits', total: 120, used: 84 },
    ]
  });

  // Create NGOs
  await prisma.partnerNGO.createMany({
    data: [
      { id: 'ngo1', name: 'Seva Foundation', zones: 'North, West', volunteers: 24, missions: 34, status: 'ACTIVE' },
      { id: 'ngo2', name: 'Hope Collective', zones: 'South', volunteers: 18, missions: 28, status: 'ACTIVE' },
      { id: 'ngo3', name: 'Zakat Relief', zones: 'East', volunteers: 9, missions: 15, status: 'ACTIVE' },
      { id: 'ngo4', name: 'GreenAid India', zones: 'West', volunteers: 12, missions: 19, status: 'PENDING' },
      { id: 'ngo5', name: 'Rural Connect', zones: 'All Zones', volunteers: 31, missions: 47, status: 'ACTIVE' },
    ]
  });

  console.log('Seeded database successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
