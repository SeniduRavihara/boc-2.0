import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  query, 
  orderBy,
  where,
  serverTimestamp,
  type Firestore
} from "firebase/firestore";
import { db } from "./config";
import { Task, TeamMember, Meeting, Quiz, QuizSubmission, Registration, ContactMessage } from "@/types";

const TASKS_COLLECTION = "tasks";
const TEAM_MEMBERS_COLLECTION = "team_members";
const MEETINGS_COLLECTION = "meetings";
const QUIZZES_COLLECTION = "quizzes";
const SUBMISSIONS_COLLECTION = "quiz_submissions";
const REGISTRATIONS_COLLECTION = "registrations";
const USERS_COLLECTION = "users";
const CONTACT_MESSAGES_COLLECTION = "contact_messages";
const MAILBOX_COLLECTION = "mailbox_messages";
const SYSTEM_LOGS_COLLECTION = "system_logs";

// Helper: ensures Firestore is initialized before any API call.
// These functions are only called from client components — Firebase will always
// be available in the browser. This guard satisfies TypeScript's null check.
function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firestore is not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set."
    );
  }
  return db;
}

// --- Users ---

export const checkAndInitializeUser = async (uid: string, email: string | null, name: string | null): Promise<string> => {
  const firestore = requireDb();
  const userRef = doc(firestore, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Initialize user with role 'user'
    await setDoc(userRef, {
      uid,
      email,
      name,
      role: 'user',
      createdAt: serverTimestamp()
    });
    return 'user';
  }

  // Return the existing role
  const userData = userSnap.data();
  return (userData.role as string) || 'user';
};

// --- Tasks ---

export const getTasks = async (): Promise<Task[]> => {
  const firestore = requireDb();
  const tasksRef = collection(firestore, TASKS_COLLECTION);
  const q = query(tasksRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task));
};

export const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
  const firestore = requireDb();
  const tasksRef = collection(firestore, TASKS_COLLECTION);
  return await addDoc(tasksRef, {
    ...task,
    createdAt: serverTimestamp()
  });
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  const firestore = requireDb();
  const taskRef = doc(firestore, TASKS_COLLECTION, id);
  return await updateDoc(taskRef, data);
};

export const deleteTask = async (id: string) => {
  const firestore = requireDb();
  const taskRef = doc(firestore, TASKS_COLLECTION, id);
  return await deleteDoc(taskRef);
};

// --- Team Members ---

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const firestore = requireDb();
  const teamRef = collection(firestore, TEAM_MEMBERS_COLLECTION);
  const q = query(teamRef, orderBy("name", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TeamMember));
};

export const addTeamMember = async (name: string) => {
  const firestore = requireDb();
  const teamRef = collection(firestore, TEAM_MEMBERS_COLLECTION);
  return await addDoc(teamRef, {
    name,
    createdAt: serverTimestamp()
  });
};

export const deleteTeamMember = async (id: string) => {
  const firestore = requireDb();
  const teamRef = doc(firestore, TEAM_MEMBERS_COLLECTION, id);
  return await deleteDoc(teamRef);
};

// --- Meetings / Attendance ---

export const getMeetings = async (): Promise<Meeting[]> => {
  const firestore = requireDb();
  const meetingsRef = collection(firestore, MEETINGS_COLLECTION);
  const q = query(meetingsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Meeting));
};

export const addMeeting = async (title: string, description: string, date: string) => {
  const firestore = requireDb();
  const meetingsRef = collection(firestore, MEETINGS_COLLECTION);
  return await addDoc(meetingsRef, {
    title,
    description,
    date,
    presentMemberIds: [],
    createdAt: serverTimestamp()
  });
};

export const updateMeetingAttendance = async (meetingId: string, presentMemberIds: string[]) => {
  const firestore = requireDb();
  const meetingRef = doc(firestore, MEETINGS_COLLECTION, meetingId);
  return await updateDoc(meetingRef, { presentMemberIds });
};

export const deleteMeeting = async (id: string) => {
  const firestore = requireDb();
  const meetingRef = doc(firestore, MEETINGS_COLLECTION, id);
  return await deleteDoc(meetingRef);
};

// --- Quizzes ---

export const getQuizzes = async (): Promise<Quiz[]> => {
  const firestore = requireDb();
  const quizzesRef = collection(firestore, QUIZZES_COLLECTION);
  const q = query(quizzesRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Quiz));
};

export const addQuiz = async (quiz: Omit<Quiz, "id" | "createdAt">) => {
  const firestore = requireDb();
  const quizzesRef = collection(firestore, QUIZZES_COLLECTION);
  return await addDoc(quizzesRef, {
    ...quiz,
    createdAt: serverTimestamp()
  });
};

export const updateQuiz = async (id: string, data: Partial<Quiz>) => {
  const firestore = requireDb();
  const quizRef = doc(firestore, QUIZZES_COLLECTION, id);
  return await updateDoc(quizRef, data);
};

export const deleteQuiz = async (id: string) => {
  const firestore = requireDb();
  const quizRef = doc(firestore, QUIZZES_COLLECTION, id);
  return await deleteDoc(quizRef);
};

export const subscribeToQuizzes = (callback: (quizzes: Quiz[]) => void) => {
  const firestore = requireDb();
  const quizzesRef = collection(firestore, QUIZZES_COLLECTION);
  const q = query(quizzesRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Quiz));
    callback(data);
  });
};

// --- Registrations ---

export const addRegistration = async (registration: Omit<Registration, "id">) => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  return await addDoc(registrationsRef, {
    ...registration,
    createdAt: serverTimestamp()
  });
};

export const checkRegistrationExists = async (email: string, sessionId: string): Promise<boolean> => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  const q = query(registrationsRef, where("email", "==", email), where("sessionId", "==", sessionId));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const getRegistrationsBySession = async (sessionId: string): Promise<Registration[]> => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  const q = query(registrationsRef, where("sessionId", "==", sessionId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Registration));
};

// --- Submissions / Leaderboard ---

export const submitQuizResult = async (submission: Omit<QuizSubmission, "id" | "completedAt">) => {
  const firestore = requireDb();
  const submissionsRef = collection(firestore, SUBMISSIONS_COLLECTION);
  return await addDoc(submissionsRef, {
    ...submission,
    completedAt: serverTimestamp()
  });
};

export const getLeaderboard = async (limitCount: number = 50): Promise<QuizSubmission[]> => {
  const firestore = requireDb();
  const submissionsRef = collection(firestore, SUBMISSIONS_COLLECTION);
  // Sort by score (desc) and then timeTaken (asc)
  const q = query(
    submissionsRef, 
    orderBy("score", "desc"),
    orderBy("timeTaken", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as QuizSubmission)).slice(0, limitCount);
};

export const subscribeToLeaderboard = (
  callback: (submissions: QuizSubmission[]) => void, 
  limitCount: number = 50
) => {
  const firestore = requireDb();
  const submissionsRef = collection(firestore, SUBMISSIONS_COLLECTION);
  const q = query(
    submissionsRef, 
    orderBy("score", "desc"),
    orderBy("timeTaken", "asc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QuizSubmission)).slice(0, limitCount);
    callback(data);
  });
};

// --- Contact Messages ---
// --- Mailbox ---

export type MailFolder = 'inbox' | 'sent' | 'archive' | 'trash';

export interface MailMessage {
  id: string;
  resend_id: string;
  direction: 'incoming' | 'outgoing';
  from_email: string;
  to_email: string;
  subject: string;
  content_text: string;
  content_html: string;
  folder: MailFolder;
  is_read: boolean;
  metadata?: any;
  createdAt: any;
}

export const fetchMailboxMessages = async (folder: MailFolder = 'inbox'): Promise<MailMessage[]> => {
  const firestore = requireDb();
  const mailboxRef = collection(firestore, MAILBOX_COLLECTION);
  const q = query(mailboxRef, where("folder", "==", folder), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as MailMessage));
};

export const updateMailMessageStatus = async (id: string, updates: Partial<MailMessage>) => {
  const firestore = requireDb();
  const messageRef = doc(firestore, MAILBOX_COLLECTION, id);
  return await updateDoc(messageRef, updates);
};

export const addMailMessage = async (message: Omit<MailMessage, "id" | "createdAt">) => {
  const firestore = requireDb();
  const mailboxRef = collection(firestore, MAILBOX_COLLECTION);
  return await addDoc(mailboxRef, {
    ...message,
    createdAt: serverTimestamp()
  });
};

export const addSystemLog = async (log: any) => {
  const firestore = requireDb();
  const logsRef = collection(firestore, SYSTEM_LOGS_COLLECTION);
  return await addDoc(logsRef, {
    ...log,
    createdAt: serverTimestamp()
  });
};

export const addContactMessage = async (message: Omit<ContactMessage, "id" | "createdAt">) => {
  const firestore = requireDb();
  const messagesRef = collection(firestore, CONTACT_MESSAGES_COLLECTION);
  return await addDoc(messagesRef, {
    ...message,
    createdAt: serverTimestamp()
  });
};