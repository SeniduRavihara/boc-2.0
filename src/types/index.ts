import { Timestamp } from "firebase/firestore";

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignees: string[];
  dueDate: string;
  createdAt?: Timestamp;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Meeting {
  id?: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  presentMemberIds: string[];
  createdAt?: Timestamp;
}

export interface Registration {
  id?: string;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  isIeeeMember?: string;
  ieeeId?: string;
  faculty?: string;
  linkedin?: string;
  attendFirstSession?: string;
  thoughts?: string;
  sessionId?: string; // Singular sessionId for top-level tracking
  sessionIds?: string[];
  sessionRegistrationTimes?: Record<string, Timestamp>;
  createdAt?: Timestamp;
}

export interface AttendanceRecord {
  id?: string;
  email: string;
  userName: string;
  organization?: string;
  sessionId: string;
  feedback?: string;
  markedAt: any; // Firestore Timestamp
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
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
  userEmail: string;
  userName: string;
  organization?: string;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
    points: number;
    timeTaken: number; // in ms
  }[];
  totalScore: number; // For backward compatibility if needed, but score is primary
  score: number;
  timeTaken: number;
  completedAt: Timestamp;
}
