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
  limit,
  serverTimestamp,
  type Firestore
} from "firebase/firestore";
import { db } from "./config";
import { Task, TeamMember, Meeting, Quiz, QuizSubmission, Registration, ContactMessage, AttendanceRecord } from "@/types";

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
const ATTENDANCE_COLLECTION = "session_attendance";
const QUIZ_PARTICIPANTS_COLLECTION = "quiz_participants";
const SETTINGS_COLLECTION = "settings";

// Helper: ensures Firestore is initialized before any API call.
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
    await setDoc(userRef, {
      uid,
      email,
      name,
      role: 'user',
      createdAt: serverTimestamp()
    });
    return 'user';
  }

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

// --- Registrations ---

export const addRegistration = async (registration: Omit<Registration, "id">) => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  
  const existingUser = await checkUserRegistration(registration.email);
  
  if (existingUser && existingUser.id) {
    const userRef = doc(firestore, REGISTRATIONS_COLLECTION, existingUser.id);
    
    // BACKWARD COMPATIBILITY: If they have legacy sessionId but no sessionIds array
    let currentSessions = existingUser.sessionIds || [];
    if (currentSessions.length === 0 && existingUser.sessionId) {
      currentSessions = [existingUser.sessionId];
    }
    
    const currentTimes = existingUser.sessionRegistrationTimes || {};
    
    // Find which session ID is being added
    const newSessionId = (registration as any).sessionId || (registration.sessionIds?.find(id => !currentSessions.includes(id))) || "1";
    
    if (!currentSessions.includes(newSessionId)) {
      return await updateDoc(userRef, {
        sessionId: newSessionId, // Force update top-level ID
        sessionIds: [...currentSessions, newSessionId],
        sessionRegistrationTimes: {
          ...currentTimes,
          [newSessionId]: serverTimestamp()
        },
        phone: registration.phone || existingUser.phone,
        organization: registration.organization || existingUser.organization
      });
    }
    
    // Even if session already in array, ensure top-level sessionId is this one
    return await updateDoc(userRef, { sessionId: newSessionId });
  }

  const newSessionId = (registration as any).sessionId || (registration.sessionIds && registration.sessionIds[0]) || "1";
  
  return await addDoc(registrationsRef, {
    ...registration,
    sessionIds: [newSessionId],
    sessionRegistrationTimes: {
      [newSessionId]: serverTimestamp()
    },
    createdAt: serverTimestamp()
  });
};

export const checkRegistrationExists = async (email: string, sessionId: string): Promise<boolean> => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  
  const q1 = query(registrationsRef, where("email", "==", email), where("sessionId", "==", sessionId));
  const q2 = query(registrationsRef, where("email", "==", email), where("sessionIds", "array-contains", sessionId));
  
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  return !snap1.empty || !snap2.empty;
};

export const getRegistrationsBySession = async (sessionId: string): Promise<Registration[]> => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  
  const q1 = query(registrationsRef, where("sessionId", "==", sessionId));
  const q2 = query(registrationsRef, where("sessionIds", "array-contains", sessionId));
  
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const results = new Map<string, Registration>();
  
  [...snap1.docs, ...snap2.docs].forEach(doc => {
    results.set(doc.id, { id: doc.id, ...doc.data() } as Registration);
  });
  
  return Array.from(results.values()).sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });
};

export const checkUserRegistration = async (email: string): Promise<Registration | null> => {
  const firestore = requireDb();
  const registrationsRef = collection(firestore, REGISTRATIONS_COLLECTION);
  const q = query(registrationsRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Registration;
  }
  return null;
};

export const deleteRegistration = async (id: string) => {
  const firestore = requireDb();
  const registrationRef = doc(firestore, REGISTRATIONS_COLLECTION, id);
  return await deleteDoc(registrationRef);
};

// --- Attendance ---

export const markAttendance = async (attendance: Omit<AttendanceRecord, "id" | "markedAt">) => {
  const firestore = requireDb();
  const attendanceRef = doc(firestore, ATTENDANCE_COLLECTION, `${attendance.sessionId}_${attendance.email}`);
  return await setDoc(attendanceRef, {
    ...attendance,
    markedAt: serverTimestamp()
  });
};

export const getAttendanceBySession = async (sessionId: string): Promise<AttendanceRecord[]> => {
  const firestore = requireDb();
  const attendanceRef = collection(firestore, ATTENDANCE_COLLECTION);
  const q = query(attendanceRef, where("sessionId", "==", sessionId), orderBy("markedAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AttendanceRecord));
};

export const checkAttendanceExists = async (email: string, sessionId: string): Promise<boolean> => {
  const firestore = requireDb();
  const attendanceRef = doc(firestore, ATTENDANCE_COLLECTION, `${sessionId}_${email}`);
  const snap = await getDoc(attendanceRef);
  return snap.exists();
};

export const getAttendanceByUser = async (email: string): Promise<AttendanceRecord[]> => {
  const firestore = requireDb();
  const attendanceRef = collection(firestore, ATTENDANCE_COLLECTION);
  const q = query(attendanceRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AttendanceRecord));
};

// --- Quizzes ---

export const addQuiz = async (quiz: Omit<Quiz, "id" | "createdAt">) => {
  const firestore = requireDb();
  const quizzesRef = collection(firestore, QUIZZES_COLLECTION);
  return await addDoc(quizzesRef, {
    ...quiz,
    createdAt: serverTimestamp()
  });
};

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

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  const firestore = requireDb();
  const quizRef = doc(firestore, QUIZZES_COLLECTION, id);
  const quizSnap = await getDoc(quizRef);
  if (quizSnap.exists()) {
    return { id: quizSnap.id, ...quizSnap.data() } as Quiz;
  }
  return null;
};

export const updateQuiz = async (id: string, updates: Partial<Quiz>) => {
  const firestore = requireDb();
  const quizRef = doc(firestore, QUIZZES_COLLECTION, id);
  return await updateDoc(quizRef, updates);
};

export const deleteQuiz = async (id: string) => {
  const firestore = requireDb();
  const quizRef = doc(firestore, QUIZZES_COLLECTION, id);
  return await deleteDoc(quizRef);
};

export const submitQuizAnswer = async (submission: Omit<QuizSubmission, "id" | "completedAt">) => {
  const firestore = requireDb();
  const submissionsRef = collection(firestore, SUBMISSIONS_COLLECTION);
  return await addDoc(submissionsRef, {
    ...submission,
    completedAt: serverTimestamp()
  });
};

export const getQuizSubmissions = async (quizId: string): Promise<QuizSubmission[]> => {
  const firestore = requireDb();
  const submissionsRef = collection(firestore, SUBMISSIONS_COLLECTION);
  const q = query(submissionsRef, where("quizId", "==", quizId), orderBy("totalScore", "desc"), orderBy("completedAt", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as QuizSubmission));
};

export const joinQuiz = async (quizId: string, registration: Registration) => {
  const firestore = requireDb();
  const participantRef = doc(firestore, QUIZ_PARTICIPANTS_COLLECTION, `${quizId}_${registration.email}`);
  return await setDoc(participantRef, {
    quizId,
    ...registration,
    joinedAt: serverTimestamp()
  });
};

export const getQuizParticipantsCount = async (quizId: string): Promise<number> => {
  const firestore = requireDb();
  const participantsRef = collection(firestore, QUIZ_PARTICIPANTS_COLLECTION);
  const q = query(participantsRef, where("quizId", "==", quizId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

// --- Global Settings ---

export const updateGlobalSettings = async (settings: any) => {
  const firestore = requireDb();
  const settingsRef = doc(firestore, SETTINGS_COLLECTION, "global");
  return await setDoc(settingsRef, settings, { merge: true });
};

export const getGlobalSettings = async () => {
  const firestore = requireDb();
  const settingsRef = doc(firestore, SETTINGS_COLLECTION, "global");
  const snap = await getDoc(settingsRef);
  return snap.exists() ? snap.data() : null;
};

// --- Mail & Contact ---

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

// --- Real-time Subscriptions ---

export const subscribeToLeaderboard = (callback: (submissions: QuizSubmission[]) => void, limitCount: number = 50) => {
  const firestore = requireDb();
  const submissionsRef = collection(firestore, SUBMISSIONS_COLLECTION);
  const q = query(
    submissionsRef, 
    orderBy("totalScore", "desc"), 
    orderBy("completedAt", "asc"),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const submissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QuizSubmission));
    callback(submissions);
  });
};