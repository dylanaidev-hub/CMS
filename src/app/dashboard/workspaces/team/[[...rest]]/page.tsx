import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamPage() {
  return (
    <PageContainer pageTitle='Team' pageDescription='Team management is not enabled.'>
      <Card>
        <CardHeader>
          <CardTitle>Team Management Disabled</CardTitle>
          <CardDescription>The CMS is currently configured for a single admin account.</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm'>
          Add a real user database before enabling team roles and permissions.
        </CardContent>
      </Card>
    </PageContainer>
  );
}
