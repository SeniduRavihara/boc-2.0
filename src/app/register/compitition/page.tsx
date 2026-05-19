import React from 'react';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import CompetitionForm from './CompetitionForm';

/**
 * COMPETITION REGISTRATION PAGE
 * 
 * This page is used for team registration specifically for the ideathon competition.
 */

export default function CompetitionRegistrationPage() {
    return (
        <RegistrationLayout>
            <CompetitionForm />
        </RegistrationLayout>
    );
}

