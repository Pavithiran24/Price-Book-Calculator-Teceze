import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, FileText, Link } from 'lucide-react';

const integrations = [
  {
    name: 'QuickBooks',
    description: 'Sync invoices and quotes to QuickBooks Online.',
    icon: <Zap className="h-6 w-6 text-green-600" />,
    comingSoon: true,
  },
  {
    name: 'Xero',
    description: 'Export your data to Xero for accounting.',
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    comingSoon: true,
  },
  {
    name: 'Salesforce',
    description: 'Push quotes to Salesforce CRM.',
    icon: <Link className="h-6 w-6 text-indigo-600" />,
    comingSoon: true,
  },
  {
    name: 'Google Sheets',
    description: 'Export and sync to Google Sheets.',
    icon: <FileText className="h-6 w-6 text-green-700" />,
    comingSoon: true,
  },
];

export const Integrations: React.FC = () => (
  <div className="max-w-2xl mx-auto py-12">
    <Card>
      <CardHeader>
        <CardTitle>Integration Marketplace</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {integrations.map((integration, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
              {integration.icon}
              <div className="flex-1">
                <div className="font-semibold text-lg">{integration.name}</div>
                <div className="text-muted-foreground text-sm">{integration.description}</div>
              </div>
              <Badge variant="outline" className="ml-2">Coming Soon</Badge>
              <Button variant="secondary" disabled size="sm">Connect</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
