"use client";

import React, { createContext, useContext, useState } from "react";
import { Task, TeamMember, Meeting } from "@/types";

/**
 * DATA CONTEXT
 * 
 * Provides global state for tasks, team members, and meetings.
 * Use this to avoid refetching data across different admin pages.
 * 
 * TODO FOR TEAM MEMBERS:
 * 1. Initialize with data from Firebase.
 * 2. Add methods to update/refetch state globally.
 */

interface DataContextType {
  tasks: Task[];
  teamMembers: TeamMember[];
  meetings: Meeting[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  return (
    <DataContext.Provider value={{ 
      tasks, 
      teamMembers, 
      meetings,
      setTasks,
      setTeamMembers,
      setMeetings
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
