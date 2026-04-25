import { Timestamp } from "firebase/firestore";

export interface Task {
  id?: string;
  title: string;
  assignees: string[];
  status: "Todo" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdAt?: Timestamp;
}

export interface TeamMember {
  id?: string;
  name: string;
  createdAt?: Timestamp;
}

export interface Meeting {
  id?: string;
  title: string;
  description: string;
  date: string;
  presentMemberIds: string[];
  createdAt?: Timestamp;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  sessionId?: string;
  isActive: boolean;
  timeLimit: number;
  questions: Question[];
  createdAt?: Timestamp;
}

export interface Registration {
  id?: string;
  name: string;
  email: string;
  organization?: string;
  sessionId: string;
  faculty?: string;
  phone?: string;
  linkedin?: string;
  attendFirstSession?: string;
  hasAwsAccount?: string;
  thoughts?: string;
  isIeeeMember?: string;
  ieeeId?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export interface QuizSubmission {
  id?: string;
  quizId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt?: Timestamp;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  telephone: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
}
