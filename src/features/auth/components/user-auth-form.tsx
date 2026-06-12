'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppForm } from '@/components/ui/tanstack-form';
import { CMS_SESSION_COOKIE, CMS_SESSION_VALUE, cmsDemoUser } from '@/lib/cms-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export default function UserAuthForm() {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useAppForm({
    defaultValues: {
      email: cmsDemoUser.email,
      password: cmsDemoUser.password
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: ({ value }) => {
      startTransition(() => {
        if (value.email !== cmsDemoUser.email || value.password !== cmsDemoUser.password) {
          toast.error('Email or password is incorrect');
          return;
        }

        document.cookie = `${CMS_SESSION_COOKIE}=${CMS_SESSION_VALUE}; path=/; max-age=86400; SameSite=Lax`;
        toast.success('Signed in successfully');
        router.replace(searchParams.get('next') || '/dashboard/news');
        router.refresh();
      });
    }
  });

  return (
    <form.AppForm>
      <form.Form className='w-full space-y-4'>
        <form.AppField
          name='email'
          children={(field) => (
            <field.FieldSet>
              <field.Field>
                <field.FieldLabel htmlFor={field.name}>Email</field.FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type='email'
                  autoComplete='email'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='admin@cms.local'
                  disabled={loading}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
              </field.Field>
              <field.FieldError />
            </field.FieldSet>
          )}
        />
        <form.AppField
          name='password'
          children={(field) => (
            <field.FieldSet>
              <field.Field>
                <field.FieldLabel htmlFor={field.name}>Password</field.FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type='password'
                  autoComplete='current-password'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Enter your password'
                  disabled={loading}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
              </field.Field>
              <field.FieldError />
            </field.FieldSet>
          )}
        />
        <Button disabled={loading} className='w-full' type='submit'>
          Sign in
        </Button>
      </form.Form>
    </form.AppForm>
  );
}
