import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Question, Quiz } from '@/types';

export async function POST() {
    try {
        const filePath = path.join(process.cwd(), 'AWS_Session_Quiz.txt');
        const content = fs.readFileSync(filePath, 'utf8');
        
        const lines = content.split('\n');
        const questions: Question[] = [];
        let currentQuestion: Partial<Question> | null = null;
        let questionCounter = 1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Detect question number (e.g., "1. Question text")
            const questionMatch = line.match(/^(\d+)\.\s+(.+)$/);
            if (questionMatch) {
                if (currentQuestion && currentQuestion.options?.length === 4) {
                    questions.push(currentQuestion as Question);
                }
                currentQuestion = {
                    id: `q${questionMatch[1]}`,
                    text: questionMatch[2],
                    options: [],
                    correctOptionIndex: -1,
                    points: 10
                };
                continue;
            }

            // Detect options (A, B, C, D)
            const optionMatch = line.match(/^([A-D])\.\s+(.+)$/);
            if (optionMatch && currentQuestion) {
                currentQuestion.options?.push(optionMatch[2]);
                continue;
            }

            // Detect answer (e.g., "■ Answer: B")
            const answerMatch = line.match(/^■\s+Answer:\s+([A-D])$/);
            if (answerMatch && currentQuestion) {
                const letter = answerMatch[1];
                currentQuestion.correctOptionIndex = letter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
                continue;
            }
            
            // Handle multi-line questions if they don't match anything else and we have a current question
            if (currentQuestion && !line.startsWith('■') && !line.match(/^[A-D]\./)) {
                currentQuestion.text += " " + line;
            }
        }

        // Push the last question
        if (currentQuestion && currentQuestion.options?.length === 4) {
            questions.push(currentQuestion as Question);
        }

        // Create the Quiz object
        const quizData: Omit<Quiz, "id" | "createdAt"> = {
            title: "Getting Into Cloud with AWS",
            description: "Session Quiz - 20 Questions on AWS Fundamentals and Cloud Core Concepts.",
            registrationTime: 5,
            defaultQuestionTime: 30,
            mode: 'manual',
            status: 'idle',
            currentQuestionIndex: 0,
            questions: questions
        };

        // Add to Firestore
        const quizzesRef = collection(db, 'quizzes');
        const docRef = await addDoc(quizzesRef, {
            ...quizData,
            createdAt: serverTimestamp()
        });

        return NextResponse.json({ 
            success: true, 
            id: docRef.id, 
            count: questions.length,
            message: "Quiz seeded successfully from AWS_Session_Quiz.txt" 
        });
    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
