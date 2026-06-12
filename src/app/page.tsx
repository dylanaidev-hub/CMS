import { CMS_SESSION_COOKIE, isCmsAuthenticated } from '@/lib/cms-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = await cookies();
  const isAuthenticated = isCmsAuthenticated(cookieStore.get(CMS_SESSION_COOKIE)?.value);

  redirect(isAuthenticated ? '/dashboard/news' : '/auth/sign-in');
}

