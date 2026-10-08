'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Inbox } from 'lucide-react';

export default function MessagesPage() {
  // Real contact messages live in the `contact_messages` table.
  // Nothing is shown until there are genuine ones to show.
  const messages: { id: number; name: string; email: string; message: string; date: string }[] = [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-4xl font-bold font-playfair text-gradient">Messages</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card text-center">
          <Inbox className="text-accent mx-auto mb-2" size={32} />
          <p className="text-2xl font-bold text-accent">{messages.length}</p>
          <p className="text-sm text-muted">Total Messages</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card text-center">
          <MessageSquare className="text-accent mx-auto mb-2" size={32} />
          <p className="text-2xl font-bold text-accent">2</p>
          <p className="text-sm text-muted">Unread</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card text-center">
          <p className="text-2xl font-bold text-accent">24h</p>
          <p className="text-sm text-muted">Avg Response</p>
        </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
        <h2 className="text-xl font-bold mb-6">Recent Messages</h2>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="border-b border-border pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-sm text-muted">{msg.email}</p>
                </div>
                <span className="text-xs text-muted">{msg.date}</span>
              </div>
              <p className="text-sm text-muted">{msg.message}</p>
              <button className="text-accent text-sm hover:underline mt-2">Reply</button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
