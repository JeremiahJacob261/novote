import CreatePoll from '@/components/CreatePoll';
import RecentPolls from '@/components/RecentPolls';

export default function Home() {
  return (
    <div className="container mx-auto p-4 bg-green-50">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Anonymous Polling App</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600">Create a New Poll</h2>
          <CreatePoll />
        </div>
        <RecentPolls />
      </div>
    </div>
  );
}

