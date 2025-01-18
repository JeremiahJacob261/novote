'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { getOrCreateSecretKey } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  created_by: string;
  options: Option[];
}

export default function PollDisplay({ pollId }: { pollId: string }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState(false);
  const secretKey = getOrCreateSecretKey();

  useEffect(() => {
    const fetchPoll = async () => {
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (pollError) {
        console.error('Error fetching poll:', pollError);
        return;
      }

      const { data: optionsData, error: optionsError } = await supabase
        .from('options')
        .select('*')
        .eq('poll_id', pollId);

      if (optionsError) {
        console.error('Error fetching options:', optionsError);
        return;
      }

      setPoll({ ...pollData, options: optionsData });
    };

    fetchPoll();

    const optionsSubscription = supabase
      .channel(`options:${pollId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'options', filter: `poll_id=eq.${pollId}` }, (payload) => {
        setPoll((currentPoll) => {
          if (!currentPoll) return null;
          const updatedOptions = currentPoll.options.map(option => 
            option.id === payload.new.id ? { ...option, votes: payload.new.votes } : option
          );
          return { ...currentPoll, options: updatedOptions };
        });
      })
      .subscribe();

    return () => {
      optionsSubscription.unsubscribe();
    };
  }, [pollId]);

  const handleVote = async (optionId: string) => {
    if (voted || !poll || poll.created_by === secretKey) return;

    const { error } = await supabase.rpc('increment_vote', { option_id: optionId });

    if (error) {
      console.error('Error voting:', error);
    } else {
      setVoted(true);
      localStorage.setItem(`voted_${pollId}`, 'true');
    }
  };

  useEffect(() => {
    const hasVoted = localStorage.getItem(`voted_${pollId}`);
    if (hasVoted) {
      setVoted(true);
    }
  }, [pollId]);

  if (!poll) return <div>Loading...</div>;

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-green-900">{poll.question}</h1>
      <p className="text-sm text-green-500">Total votes: {totalVotes}</p>
      {poll.options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        return (
          <div key={option.id} className="space-y-2">
            <Button
              onClick={() => handleVote(option.id)}
              disabled={voted || poll.created_by === secretKey}
              className="w-full justify-between bg-green-900"
            >
              <span>{option.text}</span>
              <span>{option.votes} votes ({percentage.toFixed(1)}%)</span>
            </Button>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      {poll.created_by === secretKey && (
        <p className="text-sm text-gray-500">You created this poll and cannot vote.</p>
      )}
      {voted && (
        <p className="text-sm text-gray-500">You have already voted in this poll.</p>
      )}
    </div>
  );
}

