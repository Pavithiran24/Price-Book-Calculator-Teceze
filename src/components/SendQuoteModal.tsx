import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import emailjs from 'emailjs-com';

interface SendQuoteModalProps {
  open: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
}

export const SendQuoteModal: React.FC<SendQuoteModalProps> = ({ open, onClose, pdfBlob }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email || !pdfBlob) return;
    setSending(true);
    setError('');
    setSuccess(false);
    try {
      // Convert PDF blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        await emailjs.send(
          'YOUR_SERVICE_ID',
          'YOUR_TEMPLATE_ID',
          {
            to_email: email,
            message,
            attachment: base64,
          },
          'YOUR_USER_ID'
        );
        setSuccess(true);
        setEmail('');
        setMessage('');
        onClose();
      };
      reader.readAsDataURL(pdfBlob);
    } catch (err) {
      setError('Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Quote via Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Recipient's email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Textarea
            placeholder="Optional message"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Email sent successfully!</div>}
        </div>
        <DialogFooter>
          <Button onClick={handleSend} disabled={sending || !email || !pdfBlob}>
            {sending ? 'Sending...' : 'Send Email'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
