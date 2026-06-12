import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cmsDemoUser } from '@/lib/cms-auth';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col p-4'>
      <Card className='max-w-xl'>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Current CMS administrator account</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2 text-sm'>
          <div>
            <span className='text-muted-foreground'>Name: </span>
            <span className='font-medium'>{cmsDemoUser.fullName}</span>
          </div>
          <div>
            <span className='text-muted-foreground'>Email: </span>
            <span className='font-medium'>{cmsDemoUser.email}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
