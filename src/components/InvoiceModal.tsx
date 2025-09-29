import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (client: string, dueDate: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onClose, onExport }) => {
  const [client, setClient] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export as Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Client Name / Company"
            value={client}
            onChange={e => setClient(e.target.value)}
            required
          />
          <Input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onExport(client, dueDate)} disabled={!client || !dueDate}>
            Export Invoice
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
