"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReport(data: {
  needType: string;
  location: string;
  urgency: number;
  description: string;
  contact?: string;
  priorityScore: number;
}) {
  try {
    // Create the Issue
    const issue = await prisma.issue.create({
      data: {
        needType: data.needType,
        location: data.location,
        urgency: data.urgency,
        description: data.description,
        contact: data.contact,
        priorityScore: data.priorityScore,
        status: "PENDING",
      },
    });

    // Automatically create a corresponding Mission
    let criticality = "LOW";
    if (data.priorityScore >= 80) criticality = "HIGH";
    else if (data.priorityScore >= 50) criticality = "MEDIUM";

    const missionTitle = `${data.needType} Request - ${data.location}`;
    
    await prisma.mission.create({
      data: {
        title: missionTitle,
        progress: 0,
        criticality,
        status: "ACTIVE",
      },
    });

    revalidatePath("/missions");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting report:", error);
    return { success: false, error: "Failed to save report" };
  }
}

export async function assignMission(missionId: string, volunteerId: string) {
  try {
    // Assign the volunteer to the mission
    await prisma.mission.update({
      where: { id: missionId },
      data: { volunteerId },
    });

    // Update the volunteer's status and mission count
    await prisma.volunteer.update({
      where: { id: volunteerId },
      data: {
        status: "BUSY",
        missionsCount: { increment: 1 }
      }
    });

    revalidatePath("/missions");
    revalidatePath("/volunteers");
    revalidatePath("/my-tasks");
    
    return { success: true };
  } catch (error) {
    console.error("Error assigning mission:", error);
    return { success: false, error: "Failed to assign mission" };
  }
}

import bcrypt from 'bcryptjs';

export async function createVolunteer(data: {
  name: string;
  skills: string;
  tier: string;
}) {
  try {
    // Generate deterministic credentials
    const username = data.name.toLowerCase().replace(/\s+/g, '');
    const passwordHash = await bcrypt.hash(`${username}@123`, 10);

    // Create the User and Volunteer in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          passwordHash,
          role: 'VOLUNTEER'
        }
      });

      await tx.volunteer.create({
        data: {
          userId: user.id,
          name: data.name,
          skills: data.skills,
          tier: data.tier,
          rating: 5.0,
          status: 'ACTIVE'
        }
      });
    });

    revalidatePath("/volunteers");
    
    return { success: true };
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return { success: false, error: "Failed to create volunteer" };
  }
}

import { cookies } from 'next/headers';

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('resourceos_auth');
}

export async function updatePassword(userId: string, newPassword: string) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}

export async function updateMissionProgress(missionId: string, progress: number) {
  try {
    await prisma.mission.update({
      where: { id: missionId },
      data: { progress }
    });

    revalidatePath("/my-tasks");
    revalidatePath("/missions");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating progress:", error);
    return { success: false, error: "Failed to update progress" };
  }
}

export async function completeMission(missionId: string, volunteerId: string) {
  try {
    await prisma.mission.update({
      where: { id: missionId },
      data: { 
        status: "COMPLETED",
        progress: 100 
      }
    });

    await prisma.volunteer.update({
      where: { id: volunteerId },
      data: { status: "ACTIVE" }
    });

    revalidatePath("/my-tasks");
    revalidatePath("/missions");
    revalidatePath("/volunteers");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error completing mission:", error);
    return { success: false, error: "Failed to complete mission" };
  }
}
