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

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  telephone: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  registrationTime: number; // in minutes
  defaultQuestionTime: number; // in seconds
  mode: 'manual' | 'automatic';
  status: 'idle' | 'registering' | 'in_progress' | 'finished';
  currentQuestionIndex: number;
  startTime?: Timestamp;
  questions: Question[];
  createdAt?: Timestamp;
}

export interface QuizSubmission {
  id?: string;
  quizId: string;
  email: string;
  userName: string;
  organization?: string;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
    points: number;
    timeTaken: number; // in ms
  }[];
  totalScore: number;
  completedAt: Timestamp;
}
