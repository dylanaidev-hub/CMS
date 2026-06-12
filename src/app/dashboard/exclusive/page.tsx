import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExclusivePage() {
  return (
    <PageContainer pageTitle='CMS Access' pageDescription='Plan-based access is disabled.'>
      <Card>
        <CardHeader>
          <CardTitle>Access Rules</CardTitle>
          <CardDescription>This CMS does not use subscription-plan gates.</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm'>
          All authenticated admin users can access the dashboard modules shown in navigation.
        </CardContent>
      </Card>
    </PageContainer>
  );
}
