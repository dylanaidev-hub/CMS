import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: {
    index: false
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <h1 className='text-foreground text-3xl font-bold'>Privacy Policy</h1>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>Overview</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            This local CMS version only uses a session cookie to keep an admin signed in while
            using the dashboard.
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>Authentication Data</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            The demo email and password are checked in the browser for local development. Do not
            use this implementation for production authentication.
          </p>
        </section>

        <section>
          <h2 className='text-foreground mb-3 text-xl font-semibold'>Production Note</h2>
          <p className='text-muted-foreground text-base leading-relaxed'>
            Before launch, connect authentication to a secure server-side identity store, hash
            passwords, and issue protected HTTP-only sessions.
          </p>
        </section>

        <div className='border-border border-t pt-4'>
          <p className='text-muted-foreground text-sm'>Last updated: June 2026</p>
        </div>
      </div>
    </div>
  );
}
