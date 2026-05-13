import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const sessions = [
  { ref: 'S1', date: '2025-04-26', time: '19:00', mode: 'Online', title: 'Cloud Fundamentals & AWS Core Services (IAM, EC2, S3, VPC)', type: 'AWS Workshop' },
  { ref: 'S2', date: '2025-05-07', time: '19:00', mode: 'Online', title: 'Cloud Compute & Networking (GCE, Cloud Run, VPC, Load Balancing)', type: 'GCP Workshop' },
  { ref: 'REG', date: '2025-05-08', time: '00:00', mode: 'Online', title: 'Team Registrations Open (2-week window)', type: 'Competition' },
  { ref: 'S3', date: '2025-05-16', time: '10:00', mode: 'Physical', title: 'Serverless & Cloud-Native Architecture (Lambda, API Gateway, Containers)', type: 'AWS Workshop' },
  { ref: 'S4', date: '2025-05-23', time: '10:00', mode: 'Physical', title: 'Cloud Data & Storage Solutions (BigQuery, Cloud Storage, Databases)', type: 'GCP Workshop' },
  { ref: 'PS1', date: '2025-05-24', time: '00:00', mode: 'Online', title: 'Round 1 Problem Statement Release', type: 'Competition' },
  { ref: 'S5', date: '2025-06-02', time: '19:00', mode: 'Online', title: 'DevOps, SRE & Platform Engineering (CI/CD, IaC, Observability)', type: 'AWS Workshop' },
  { ref: 'S6', date: '2025-06-07', time: '10:00', mode: 'Physical', title: 'Cloud Security & Production Best Practices (IAM, Monitoring, Cost)', type: 'GCP Workshop' },
  { ref: '-', date: '2025-06-29', time: '00:00', mode: 'Blocked', title: 'EXAM BLACKOUT — No workshops. Teams work async on solutions.', type: 'Exam Blackout' },
  { ref: 'D1', date: '2025-07-02', time: '19:00', mode: 'Online', title: '[DMZ] Office Hours — Optional async Q&A on quizizz(wayground)', type: 'DMZ Light Activity' },
  { ref: 'D2', date: '2025-07-09', time: '19:00', mode: 'Online', title: '[DMZ] Architecture Review — Drop drafts in #arch-review with knowledge partners', type: 'DMZ Light Activity' },
  { ref: 'D3', date: '2025-07-16', time: '19:00', mode: 'Online', title: '[DMZ] Cloud Article series', type: 'DMZ Light Activity' },
  { ref: 'R1', date: '2025-07-20', time: '23:59', mode: 'Online', title: 'Round 1 Deadline — Architecture & Proposal Submission', type: 'Competition' },
  { ref: 'R1R', date: '2025-07-23', time: '19:00', mode: 'Online', title: 'Round 1 Results & Shortlist Announcement', type: 'Competition' },
  { ref: 'R2', date: '2025-07-26', time: '09:00', mode: 'Physical', title: 'Round 2 — Live Prototype Demo (Shortlisted Teams)', type: 'Competition' },
  { ref: 'F', date: '2025-08-02', time: '09:00', mode: 'Physical', title: 'Grand Finale — Final Pitches, Judging & Awards Ceremony', type: 'Finale' },
];

export async function GET() {
  try {
    const colRef = collection(db, 'sessions');
    
    // Clear existing sessions
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Add new sessions
    const addPromises = sessions.map(session => addDoc(colRef, session));
    await Promise.all(addPromises);

    return NextResponse.json({ success: true, message: `Cleared and re-seeded ${sessions.length} sessions successfully.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
