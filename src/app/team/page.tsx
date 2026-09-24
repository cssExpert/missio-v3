import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function TeamPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /team */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Team | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
