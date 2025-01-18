import Link from 'next/link';
import PollDisplay from '@/components/PollDisplay';

export default function PollPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <PollDisplay pollId={params.id} />
      <div className="mt-8 text-sm text-gray-500">
        <p>This is an anonymous poll. Your vote is kept private.</p>
        <p>Share this page's URL with others to let them vote on this poll.</p>
      </div>
    </div>
  );
}

