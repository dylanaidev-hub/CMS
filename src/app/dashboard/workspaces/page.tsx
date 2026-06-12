import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkspacesPage() {
  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Workspace management is disabled for this CMS.'
    >
      <Card>
        <CardHeader>
          <CardTitle>Single CMS Workspace</CardTitle>
          <CardDescription>This project now uses a simple single-admin CMS setup.</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm'>
          Third-party organization management has been removed from the active interface.
        </CardContent>
      </Card>
    </PageContainer>
  );
}
