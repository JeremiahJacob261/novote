'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Poll {
  id: string;
  question: string;
  created_at: string;
}

export default function RecentPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchRecentPolls = async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('id, question, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent polls:', error);
      } else {
        setPolls(data || []);
      }
    };

    fetchRecentPolls();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Polls</h2>
      <ul className="space-y-2">
        {polls.map((poll) => (
          <li key={poll.id} className="border p-4 rounded-md hover:bg-gray-50">
            <Link href={`/poll/${poll.id}`} className="block">
              <h3 className="font-semibold">{poll.question}</h3>
              <p className="text-sm text-gray-500">
                Created on {new Date(poll.created_at).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

