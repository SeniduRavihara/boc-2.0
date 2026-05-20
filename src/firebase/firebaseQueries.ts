import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  teamName: string;
  registeredAt: string;
}

export interface Team {
  id: string;
  name: string;
}

// Get all unique teams
export async function getAllTeams(): Promise<Team[]> {
  if (!db) return [];
  try {
    const teamsRef = collection(db, "competition_teams");
    const q = query(teamsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().teamName || "",
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// Get team members by team name
export async function getTeamMembers(teamName: string): Promise<TeamMember[]> {
  if (!db) return [];
  try {
    const teamsRef = collection(db, "competition_teams");
    const q = query(
      teamsRef,
      where("teamNameLowercase", "==", teamName.toLowerCase().trim())
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const teamDoc = snapshot.docs[0];
    const teamData = teamDoc.data();

    const leader: TeamMember = {
      id: teamDoc.id,
      name: teamData.leaderName || "",
      email: teamData.leaderEmail || "",
      teamName: teamData.teamName || "",
      registeredAt: teamData.createdAt?.toDate?.().toISOString() || "",
    };

    const members = (teamData.members || []).map((member: { name?: string; email?: string }) => ({
      id: teamDoc.id,
      name: member.name || "",
      email: member.email || "",
      teamName: teamData.teamName || "",
      registeredAt: teamData.createdAt?.toDate?.().toISOString() || "",
    }));

    return [leader, ...members];
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}