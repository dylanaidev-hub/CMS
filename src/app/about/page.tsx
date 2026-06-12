import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-12 text-center'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>About CMS</h1>
          <p className='text-muted-foreground mt-4 text-lg'>
            A focused dashboard for managing CMS operations.
          </p>
        </div>

        <div className='space-y-8'>
          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>Dashboard</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              This CMS includes dashboard views, product and user management screens, forms,
              notifications, and supporting admin tools.
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>Authentication</h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              The current local version uses a simple email and password gate for the admin
              dashboard. Replace it with a database-backed auth flow before production use.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
