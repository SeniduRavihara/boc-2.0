export const SESSIONS = [
    { id: "1", name: "Session 1", topic: "Cloud Foundations" },
    { id: "2", name: "Session 2", topic: "AWS Deep Dive" },
    { id: "3", name: "Session 3", topic: "GCP Fundamentals" },
    { id: "4", name: "Session 4", topic: "Azure Architecture" },
    { id: "5", name: "Session 5", topic: "DevOps & CI/CD" },
    { id: "6", name: "Session 6", topic: "Serverless Patterns" },
];

export const getSessionName = (id: string) => {
    const session = SESSIONS.find(s => s.id === id);
    return session ? session.name : `Session ${id}`;
};
