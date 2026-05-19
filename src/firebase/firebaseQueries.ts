import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
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
  if(!db) return [];
  try {
    const membersRef = collection(db, "competition_registrations");
    const snapshot = await getDocs(membersRef);

    const teamsSet = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.teamName) {
        teamsSet.add(data.teamName);
      }
    });

    return Array.from(teamsSet).map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// Get team members by team name
export async function getTeamMembers(teamName: string): Promise<TeamMember[]> {
  if(!db) return [];
  try {
    const membersRef = collection(db, "competition_registrations");
    const q = query(membersRef, where("teamName", "==", teamName));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
      teamName: doc.data().teamName || "",
      registeredAt: doc.data().registeredAt || "",
    }));
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}
