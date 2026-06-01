export const SESSIONS = [
    { id: "1", name: "Session 1", topic: "Getting Into the Cloud with AWS" },
    { id: "2", name: "Session 2", topic: "Cloud Compute & Networking on GCP" },
    { id: "3", name: "Session 3", topic: "What really happens when you open Instagram?" },
    { id: "4", name: "Session 4", topic: "Azure Architecture" },
    { id: "5", name: "Session 5", topic: "DevOps & CI/CD" },
    { id: "6", name: "Session 6", topic: "Serverless Patterns" },
];

export const getSessionName = (id: string) => {
    const session = SESSIONS.find(s => s.id === id);
    return session ? session.name : `Session ${id}`;
};
