import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HomeClient } from '@/components/HomeClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const revealPassword = process.env.REVEAL_HOME_PASSWORD;
  const revealHomeQuery = params['reveal-home'];

  // If password is set, check if user is authorized ONLY via query param
  if (revealPassword) {
    const isAuthorized = revealHomeQuery === revealPassword;
    
    if (!isAuthorized) {
      redirect('/register/session/1');
    }
  } else {
    // If NO password is set in ENV, we ALWAYS redirect to register
    redirect('/register/session/1');
  }

  return <HomeClient />;
}
