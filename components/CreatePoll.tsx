'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getOrCreateSecretKey } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const secretKey = getOrCreateSecretKey();
    
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({ question, created_by: secretKey })
      .select()
      .single();

    if (pollError) {
      console.error('Error creating poll:', pollError);
      return;
    }

    const optionsToInsert = options
      .filter(o => o.trim() !== '')
      .map(text => ({ text, poll_id: poll.id }));

    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optionsError) {
      console.error('Error creating options:', optionsError);
      return;
    }

    window.location.href = `/poll/${poll.id}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        required
      />
      {options.map((option, index) => (
        <Input
          key={index}
          type="text"
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${index + 1}`}
          required
        />
      ))}
      <Button 
        type="button" 
        onClick={() => setOptions([...options, ''])}
        className="m-2 bg-green-500 hover:bg-green-600 text-white"
      >
        Add Option
      </Button>
      <Button type="submit" className="m-2 bg-gray-200 hover:bg-gray-300 text-green-500">Create Poll</Button>
    </form>
  );
}

