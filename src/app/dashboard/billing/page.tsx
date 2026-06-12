import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingPage() {
  return (
    <PageContainer pageTitle='Billing' pageDescription='Billing is not configured for this CMS.'>
      <Card>
        <CardHeader>
          <CardTitle>No Billing Provider</CardTitle>
          <CardDescription>External billing has been removed from the active CMS flow.</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm'>
          Connect your preferred billing system when subscriptions are needed.
        </CardContent>
      </Card>
    </PageContainer>
  );
}
