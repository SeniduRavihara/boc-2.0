"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuizzes } from '@/firebase/api';
import { HelpCircle, AlertCircle } from 'lucide-react';

export default function SessionQuizRedirect() {
    const { sessionId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const findAndRedirect = async () => {
            try {
                const allQuizzes = await getQuizzes();
                const activeQuiz = allQuizzes.find(q => q.sessionId === sessionId && q.isActive);
                
                if (activeQuiz) {
                    router.push(`/quiz/${activeQuiz.id}`);
                } else {
                    setError("No active quiz found for this session.");
                    setLoading(false);
                }
            } catch (err) {
                setError("Failed to load quizzes.");
                setLoading(false);
            }
        };

        findAndRedirect();
    }, [sessionId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Finding active quiz for session...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={64} className="text-rose-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-2">Notice</h2>
                <p className="text-slate-500 mb-8">{error}</p>
                <button onClick={() => router.push('/quiz')} className="px-8 py-3 bg-white text-black rounded-xl font-bold">Back to Selection</button>
            </div>
        );
    }

    return null;
}
